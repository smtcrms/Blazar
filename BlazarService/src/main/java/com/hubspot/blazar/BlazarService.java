package com.hubspot.blazar;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.hubspot.blazar.config.BlazarConfiguration;
import com.hubspot.blazar.github.BackfillGitHubDataCommand;
import com.hubspot.blazar.guice.BlazarServiceModule;
import com.hubspot.blazar.guice.GuiceBundle;
import com.hubspot.jackson.datatype.protobuf.ProtobufModule;
import io.dropwizard.Application;
import io.dropwizard.ConfiguredBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class BlazarService<T extends BlazarConfiguration> extends Application<T> {

  @Override
  public void initialize(final Bootstrap<T> bootstrap) {
    bootstrap.addBundle(buildGuiceBundle());
    bootstrap.addBundle(new CorsBundle());
    bootstrap.getObjectMapper().registerModule(new ProtobufModule());
    bootstrap.getObjectMapper().setSerializationInclusion(Include.NON_NULL);
    bootstrap.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    bootstrap.addCommand(new BackfillGitHubDataCommand());
  }

  @Override
  public void run(final T configuration, final Environment environment) {}

  private ConfiguredBundle<BlazarConfiguration> buildGuiceBundle() {
    return GuiceBundle.defaultBuilder(BlazarConfiguration.class).modules(new BlazarServiceModule()).build();
  }

  public static void main(String... args) throws Exception {
    try {
      new BlazarService<>().run(args);
    } catch (Throwable t) {
      t.printStackTrace();
      System.exit(1);
    }
  }
}
