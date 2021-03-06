package com.hubspot.blazar.resources;

import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import com.hubspot.blazar.base.notifications.InstantMessageConfiguration;
import com.hubspot.blazar.data.service.InstantMessageConfigurationService;
import com.hubspot.jackson.jaxrs.PropertyFiltering;

@Path("/instant-message-configurations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InstantMessageResource {

  @Inject
  private final InstantMessageConfigurationService instantMessageConfigurationService;

  @Inject
  public InstantMessageResource(InstantMessageConfigurationService instantMessageConfigurationService) {
    this.instantMessageConfigurationService = instantMessageConfigurationService;
  }

  @GET
  @PropertyFiltering
  public Set<InstantMessageConfiguration> getAll() {
    return instantMessageConfigurationService.getAll();
  }

  @GET
  @Path("/{id}")
  @PropertyFiltering
  public Optional<InstantMessageConfiguration> get(@PathParam("id") long id) {
    return instantMessageConfigurationService.get(id);
  }

  @PUT
  @Path("/{id}")
  public void update(InstantMessageConfiguration instantMessageConfiguration, @PathParam("id") long id) {
    instantMessageConfigurationService.update(instantMessageConfiguration.withNewId(id));
  }

  @POST
  public InstantMessageConfiguration insert(InstantMessageConfiguration instantMessageConfiguration) {
    return instantMessageConfigurationService.insert(instantMessageConfiguration);
  }

  @DELETE
  @Path("/{id}")
  public void delete(@PathParam("id") long id) {
    instantMessageConfigurationService.delete(id);
  }

  @GET
  @Path("/branch/{branchId}")
  @PropertyFiltering
  public Set<InstantMessageConfiguration> getAllByBranchId(@PathParam("branchId") long branchId) {
    return instantMessageConfigurationService.getAllWithBranchId(branchId);
  }
}
