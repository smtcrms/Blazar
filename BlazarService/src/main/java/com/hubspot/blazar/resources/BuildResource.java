package com.hubspot.blazar.resources;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import com.hubspot.blazar.base.BuildDefinition;
import com.hubspot.blazar.base.BuildState;
import com.hubspot.blazar.base.LogChunk;
import com.hubspot.blazar.base.ModuleBuild;
import com.hubspot.blazar.data.service.BuildDefinitionService;
import com.hubspot.blazar.data.service.BuildService;
import com.hubspot.horizon.AsyncHttpClient;
import com.hubspot.horizon.HttpRequest;
import com.hubspot.horizon.HttpResponse;
import com.hubspot.jackson.jaxrs.PropertyFiltering;
import com.hubspot.mesos.json.MesosFileChunkObject;
import com.hubspot.singularity.SingularityS3Log;
import com.hubspot.singularity.client.SingularityClient;
import com.sun.jersey.api.NotFoundException;

import java.util.Collection;
import java.util.Set;

@Path("/build")
@Produces(MediaType.APPLICATION_JSON)
public class BuildResource {
  private final BuildDefinitionService buildDefinitionService;
  private final BuildService buildService;
  private final SingularityClient singularityClient;
  private final AsyncHttpClient asyncHttpClient;

  @Inject
  public BuildResource(BuildDefinitionService buildDefinitionService,
                       BuildService buildService,
                       SingularityClient singularityClient,
                       AsyncHttpClient asyncHttpClient) {
    this.buildDefinitionService = buildDefinitionService;
    this.buildService = buildService;
    this.singularityClient = singularityClient;
    this.asyncHttpClient = asyncHttpClient;
  }

  @GET
  @Path("/definitions")
  @PropertyFiltering
  public Response getAllBuildDefinitions(@QueryParam("since") @DefaultValue("0") long since) {
    Set<BuildDefinition> buildDefinitions = buildDefinitionService.getAllActive(since);
    long offset = Math.max(maxUpdatedTimestamp(buildDefinitions), since);

    return Response.ok(buildDefinitions).header("x-last-modified-timestamp", offset).build();
  }

  @GET
  @Path("/{id}")
  public Optional<ModuleBuild> get(@PathParam("id") long id) {
    return buildService.get(id);
  }

  @GET
  @Path("/{id}/log")
  public LogChunk getLog(@PathParam("id") long id,
                         @QueryParam("offset") @DefaultValue("0") long offset,
                         @QueryParam("length") @DefaultValue("90000") long length) throws Exception {
    Optional<ModuleBuild> build = get(id);
    if (!build.isPresent()) {
      throw new NotFoundException("No build found for ID " + id);
    }

    boolean completed = build.get().getBuild().getState().isComplete();
    Optional<String> taskId = build.get().getBuild().getTaskId();
    if (!taskId.isPresent()) {
      throw new NotFoundException("No taskId found for build ID " + id);
    }

    String path = taskId.get() + "/service.log";
    Optional<String> grep = Optional.absent();

    Optional<MesosFileChunkObject> chunk = singularityClient.readSandBoxFile(taskId.get(), path, grep, Optional.of(offset), Optional.of(length));
    if (chunk.isPresent()) {
      if (completed && chunk.get().getData().isEmpty()) {
        return new LogChunk(chunk.get().getData(), chunk.get().getOffset(), -1);
      } else {
        return new LogChunk(chunk.get().getData(), chunk.get().getOffset());
      }
    } else {
      Collection<SingularityS3Log> s3Logs = singularityClient.getTaskLogs(taskId.get());
      if (s3Logs.isEmpty()) {
        throw new NotFoundException("No S3 log found for ID " + id);
      } else if (s3Logs.size() > 1) {
        throw new NotFoundException("Multiple S3 logs found for ID " + id);
      }

      SingularityS3Log s3Log = s3Logs.iterator().next();
      if (offset >= s3Log.getSize()) {
        return new LogChunk("", s3Log.getSize(), -1);
      }

      return fetchS3Log(s3Log.getGetUrl(), offset, length);
    }
  }

  @POST
  @Path("/module/{moduleId}")
  public ModuleBuild trigger(@PathParam("moduleId") int moduleId) {
    return trigger(buildDefinitionService.getByModule(moduleId).get());
  }

  @POST
  public ModuleBuild trigger(BuildDefinition buildDefinition) {
    BuildState buildState = buildService.enqueue(buildDefinition);

    return new ModuleBuild(buildState.getGitInfo(), buildState.getModule(), buildState.getPendingBuild().get());
  }

  @POST
  @Path("/{id}/cancel")
  public void cancel(@PathParam("id") long id) {
    Optional<ModuleBuild> build = get(id);
    if (!build.isPresent()) {
      throw new NotFoundException("No build found for ID " + id);
    }

    buildService.cancel(build.get().getBuild());
  }

  @PUT
  public ModuleBuild update(ModuleBuild moduleBuild) {
    buildService.update(moduleBuild.getBuild());
    return moduleBuild;
  }

  private LogChunk fetchS3Log(String url, long offset, long length) throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .setUrl(url)
        .addHeader("Range", String.format("bytes=%d-%d", offset, offset + length))
        .build();

    HttpResponse response = asyncHttpClient.execute(request).get();
    if (response.isSuccess()) {
      return new LogChunk(response.getAsBytes(), offset);
    } else {
      String message = String.format("Error reading S3 log, status code %d, response %s", response.getStatusCode(), response.getAsString());
      throw new WebApplicationException(Response.serverError().entity(message).type(MediaType.TEXT_PLAIN_TYPE).build());
    }
  }

  private static long maxUpdatedTimestamp(Collection<? extends BuildDefinition> definitions) {
    long maxUpdatedTimestamp = 0;
    for (BuildDefinition definition : definitions) {
      if (definition.getModule().getUpdatedTimestamp() > maxUpdatedTimestamp) {
        maxUpdatedTimestamp = definition.getModule().getUpdatedTimestamp();
      }
    }

    return maxUpdatedTimestamp;
  }
}
