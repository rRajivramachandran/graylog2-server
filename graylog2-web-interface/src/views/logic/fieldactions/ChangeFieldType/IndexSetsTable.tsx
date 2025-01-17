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
import React, { useMemo, useCallback, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

import {
  PaginatedList,
  Spinner,
  NoEntitiesExist,
  EntityDataTable,
  Icon,
} from 'components/common';
import { Button } from 'components/bootstrap';
import { DEFAULT_LAYOUT, ENTITY_TABLE_ID } from 'views/logic/fieldactions/ChangeFieldType/Constants';
import useTableLayout from 'components/common/EntityDataTable/hooks/useTableLayout';
import type { SearchParams, Sort } from 'views/logic/fieldactions/ChangeFieldType/hooks/useFieldTypeUsages';
import useFieldTypeUsages from 'views/logic/fieldactions/ChangeFieldType/hooks/useFieldTypeUsages';
import useUpdateUserLayoutPreferences from 'components/common/EntityDataTable/hooks/useUpdateUserLayoutPreferences';
import type { FieldTypeUsage, FieldTypes } from 'views/logic/fieldactions/ChangeFieldType/types';
import useColumnRenderers from 'views/logic/fieldactions/ChangeFieldType/hooks/useColumnRenderers';
import BulkActionsDropdown from 'components/common/EntityDataTable/BulkActionsDropdown';
import { ActionContext } from 'views/logic/ActionContext';
import useCurrentQuery from 'views/logic/queries/useCurrentQuery';
import { filtersToStreamSet } from 'views/logic/queries/Query';
import useInitialSelection from 'views/logic/fieldactions/ChangeFieldType/hooks/useInitialSelection';

const Container = styled.div`
  margin-top: 20px;
`;

type Props = {
  field: string,
  setIndexSetSelection: React.Dispatch<Array<string>>,
  fieldTypes: FieldTypes
}

const renderBulkActions = (
  selectedDashboardIds: Array<string>,
  setSelectedDashboardIds: (streamIds: Array<string>) => void,
) => (
  <BulkActionsDropdown selectedEntities={selectedDashboardIds} setSelectedEntities={setSelectedDashboardIds} />
);

const IndexSetsTable = ({ field, setIndexSetSelection, fieldTypes }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const { widget, message } = useContext(ActionContext);
  const currentQuery = useCurrentQuery();
  const currentStreams = useMemo(() => message?.fields?.streams ?? widget?.streams ?? filtersToStreamSet(currentQuery.filter).toJS() ?? [], [message?.fields?.streams, currentQuery.filter, widget?.streams]);

  const { layoutConfig, isInitialLoading: isLoadingLayoutPreferences } = useTableLayout({
    entityTableId: ENTITY_TABLE_ID,
    defaultPageSize: DEFAULT_LAYOUT.pageSize,
    defaultDisplayedAttributes: DEFAULT_LAYOUT.displayedColumns,
    defaultSort: DEFAULT_LAYOUT.sort,
  });

  const searchParams: SearchParams = useMemo(() => ({
    page: activePage,
    pageSize: layoutConfig.pageSize,
    sort: layoutConfig.sort as Sort,
  }), [activePage, layoutConfig.pageSize, layoutConfig.sort]);
  const { data: { list, attributes, pagination }, isLoading } = useFieldTypeUsages({ field, streams: currentStreams }, searchParams, { enabled: !isLoadingLayoutPreferences && !!currentStreams });
  const initialSelection = useInitialSelection(currentStreams);

  const { mutate: updateTableLayout } = useUpdateUserLayoutPreferences(ENTITY_TABLE_ID);

  useEffect(() => {
    setIndexSetSelection(initialSelection);
  }, [initialSelection, setIndexSetSelection]);

  const onPageChange = useCallback(
    (newPage: number, newPageSize: number) => {
      if (newPage) {
        setActivePage(newPage);
      }

      if (newPageSize) {
        updateTableLayout({ perPage: newPageSize });
      }
    }, [updateTableLayout],
  );

  const onPageSizeChange = useCallback((newPageSize: number) => {
    setActivePage(1);
    updateTableLayout({ perPage: newPageSize });
  }, [updateTableLayout]);

  const onSortChange = useCallback((newSort: Sort) => {
    setActivePage(1);
    updateTableLayout({ sort: newSort });
  }, [updateTableLayout]);

  const onColumnsChange = useCallback((displayedAttributes: Array<string>) => {
    updateTableLayout({ displayedAttributes });
  }, [updateTableLayout]);

  const columnRenderers = useColumnRenderers(fieldTypes);

  const onChangeSelection = useCallback((newSelection: Array<string>) => {
    setIndexSetSelection(newSelection);
  }, [setIndexSetSelection]);

  const toggleDetailsOpen = useCallback(() => {
    setShowDetails((cur) => !cur);
  }, []);

  if (isLoadingLayoutPreferences || isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Button label={showDetails ? 'Hide index sets' : 'Show index sets'} bsStyle="link" className="btn-text" bsSize="xsmall" onClick={toggleDetailsOpen}>
        <Icon name={`caret-${showDetails ? 'down' : 'right'}`} />&nbsp;
        {showDetails ? 'Hide index sets' : 'Show index sets'}
      </Button>
      {
          showDetails && (
            <Container>
              <PaginatedList onChange={onPageChange}
                             totalItems={pagination?.total}
                             pageSize={layoutConfig.pageSize}
                             activePage={activePage}
                             showPageSizeSelect={false}
                             useQueryParameter={false}>
                {!list?.length && (
                  <NoEntitiesExist>
                    No index sets have been found.
                  </NoEntitiesExist>
                )}
                {list.length && (
                  <EntityDataTable<FieldTypeUsage> activeSort={layoutConfig.sort}
                                                   bulkSelection={{
                                                     onChangeSelection,
                                                     initialSelection,
                                                     actions: renderBulkActions,
                                                   }}
                                                   columnDefinitions={attributes}
                                                   columnRenderers={columnRenderers}
                                                   columnsOrder={DEFAULT_LAYOUT.columnsOrder}
                                                   data={list}
                                                   onColumnsChange={onColumnsChange}
                                                   onPageSizeChange={onPageSizeChange}
                                                   onSortChange={onSortChange}
                                                   pageSize={layoutConfig.pageSize}
                                                   visibleColumns={layoutConfig.displayedAttributes} />
                )}
              </PaginatedList>
            </Container>
          )
        }
    </>
  );
};

export default IndexSetsTable;
