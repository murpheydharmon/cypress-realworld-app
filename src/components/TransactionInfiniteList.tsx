import React, { useCallback, useRef } from "react";
import { styled } from "@mui/material/styles";
import { get } from "lodash/fp";
import { useTheme, useMediaQuery, Divider } from "@mui/material";
import { List, RowComponentProps } from "react-window";

import TransactionItem from "./TransactionItem";
import { TransactionResponseItem, TransactionPagination } from "../models";

const PREFIX = "TransactionInfiniteList";

const classes = {
  transactionList: `${PREFIX}-transactionList`,
};

const StyledDiv = styled("div")(() => ({
  [`&.${classes.transactionList}`]: {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

export interface TransactionListProps {
  transactions: TransactionResponseItem[];
  loadNextPage: Function;
  pagination: TransactionPagination;
}

interface RowExtraProps {
  transactions: TransactionResponseItem[];
  isMobile: boolean;
}

const Row = ({ index, style, transactions, isMobile }: RowComponentProps<RowExtraProps>) => {
  const transaction = get(index, transactions);

  if (index < transactions.length) {
    return (
      <div style={style}>
        <TransactionItem transaction={transaction} />
        <Divider variant={isMobile ? "fullWidth" : "inset"} />
      </div>
    );
  }
  return null;
};

const TransactionInfiniteList: React.FC<TransactionListProps> = ({
  transactions,
  loadNextPage,
  pagination,
}) => {
  const theme = useTheme();
  const isXsBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const loadingRef = useRef(false);

  const itemCount = pagination.hasNextPages ? transactions.length + 1 : transactions.length;

  const removePx = (str: string) => +str.slice(0, str.length - 2);

  const listHeight = isXsBreakpoint ? removePx(theme.spacing(74)) : removePx(theme.spacing(88));
  const itemSize = isXsBreakpoint ? removePx(theme.spacing(28)) : removePx(theme.spacing(16));

  const handleRowsRendered = useCallback(
    (
      visibleRows: { startIndex: number; stopIndex: number },
      _allRows: { startIndex: number; stopIndex: number }
    ) => {
      if (
        pagination.hasNextPages &&
        visibleRows.stopIndex >= transactions.length - 1 &&
        !loadingRef.current
      ) {
        loadingRef.current = true;
        Promise.resolve(loadNextPage(pagination.page + 1)).then(() => {
          loadingRef.current = false;
        });
      }
    },
    [pagination.hasNextPages, pagination.page, transactions.length, loadNextPage]
  );

  return (
    <StyledDiv data-test="transaction-list" className={classes.transactionList}>
      <List
        style={{ height: listHeight }}
        rowComponent={Row}
        rowCount={itemCount}
        rowHeight={itemSize}
        rowProps={{ transactions, isMobile }}
        onRowsRendered={handleRowsRendered}
      />
    </StyledDiv>
  );
};

export default TransactionInfiniteList;
