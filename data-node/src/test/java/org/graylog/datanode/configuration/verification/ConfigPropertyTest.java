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
package org.graylog.datanode.configuration.verification;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ConfigPropertyTest {

    @Test
    void testRequiresPropertyNameToBeProvided() {
        assertThrows(IllegalArgumentException.class, () -> new ConfigProperty(null, "value"));
        assertThrows(IllegalArgumentException.class, () -> new ConfigProperty("", "value"));
    }

    @Test
    void testHoldsProperties() {
        final ConfigProperty configProperty = new ConfigProperty("name", "value");
        assertEquals("name", configProperty.propertyName());
        assertEquals("value", configProperty.propertyValue());
    }
}
