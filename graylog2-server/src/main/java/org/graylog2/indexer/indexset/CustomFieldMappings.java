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
package org.graylog2.indexer.indexset;

import com.google.common.collect.ImmutableMap;
import org.graylog2.indexer.fieldtypes.FieldTypeMapper;
import org.graylog2.indexer.fieldtypes.FieldTypes;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomFieldMappings extends HashSet<CustomFieldMapping> {
    public record TypeDescription(String description, FieldTypes.Type type) {}

    public static final Map<String, TypeDescription> AVAILABLE_TYPES = ImmutableMap.<String, TypeDescription>builder()
            .put("string", new TypeDescription("String (aggregatable)", FieldTypeMapper.STRING_TYPE))
            .put("string_fts", new TypeDescription("String (full-text searchable)", FieldTypeMapper.STRING_FTS_TYPE))
            .put("long", new TypeDescription("Number (long)", FieldTypeMapper.LONG_TYPE))
            .put("int", new TypeDescription("Number (int)", FieldTypeMapper.INT_TYPE))
            .put("short", new TypeDescription("Number (short)", FieldTypeMapper.SHORT_TYPE))
            .put("byte", new TypeDescription("Byte", FieldTypeMapper.BYTE_TYPE))
            .put("double", new TypeDescription("Floating Point Number (double)", FieldTypeMapper.DOUBLE_TYPE))
            .put("float", new TypeDescription("Floating Point Number (float)", FieldTypeMapper.FLOAT_TYPE))
            .put("date", new TypeDescription("Date", FieldTypeMapper.DATE_TYPE))
            .put("boolean", new TypeDescription("Boolean", FieldTypeMapper.BOOLEAN_TYPE))
            .put("binary", new TypeDescription("Binary Data", FieldTypeMapper.BINARY_TYPE))
            .put("geo-point", new TypeDescription("Geo Point", FieldTypeMapper.GEO_POINT_TYPE))
            .put("ip", new TypeDescription("IP", FieldTypeMapper.IP_TYPE))
            .build();

    public static final Map<FieldTypes.Type, String> REVERSE_TYPES = AVAILABLE_TYPES.entrySet()
            .stream()
            .collect(Collectors.toMap(entry -> entry.getValue().type, Map.Entry::getKey));

    public CustomFieldMappings() {
        super();
    }

    public CustomFieldMappings(final Collection<CustomFieldMapping> mappings) {
        super(mappings);
    }

    public CustomFieldMappings mergeWith(final CustomFieldMapping changedMapping) {
        final Set<CustomFieldMapping> modifiedMappings = new HashSet<>(this);
        modifiedMappings.removeIf(m -> changedMapping.fieldName().equals(m.fieldName()));
        modifiedMappings.add(changedMapping);
        return new CustomFieldMappings(modifiedMappings);
    }
}
