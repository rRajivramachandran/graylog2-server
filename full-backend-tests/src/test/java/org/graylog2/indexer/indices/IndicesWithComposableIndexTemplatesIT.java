/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
package org.graylog2.indexer.indices;

import org.graylog.testing.completebackend.Lifecycle;
import org.graylog.testing.containermatrix.MongodbServer;
import org.graylog.testing.containermatrix.annotations.ContainerMatrixTestsConfiguration;
import org.graylog.testing.elasticsearch.SearchServerInstance;

import static org.graylog2.indexer.Constants.COMPOSABLE_INDEX_TEMPLATES_FEATURE;

@ContainerMatrixTestsConfiguration(serverLifecycle = Lifecycle.CLASS, mongoVersions = MongodbServer.MONGO5, enabledFeatureFlags = COMPOSABLE_INDEX_TEMPLATES_FEATURE)
public class IndicesWithComposableIndexTemplatesIT extends IndicesIT {
    public IndicesWithComposableIndexTemplatesIT(SearchServerInstance elasticsearch) {
        super(elasticsearch);
    }
}
