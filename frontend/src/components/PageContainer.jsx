"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Link } from "react-router";

const PageContentHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const PageHeaderToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  marginLeft: "auto",
  flexWrap: "wrap",
}));

function PageContainer(props) {
  const {
    children,
    breadcrumbs,
    title,
    actions = null,
    maxWidth = "lg",
    disableGutters = false,
    containerSx = {},
    contentSx = {},
    fullHeight = false,
  } = props;

  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: fullHeight ? "100%" : "auto",
        px: disableGutters ? 0 : { xs: 2, sm: 3 },
        ...containerSx,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          my: 2,
          minWidth: 0,
          minHeight: 0,
        }}
        spacing={2}
      >
        {(breadcrumbs || title || actions) && (
          <Stack>
            {breadcrumbs ? (
              <PageHeaderBreadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextRoundedIcon fontSize="small" />}
              >
                {breadcrumbs.map((breadcrumb, index) =>
                  breadcrumb.path ? (
                    <MuiLink
                      key={index}
                      component={Link}
                      underline="hover"
                      color="inherit"
                      to={breadcrumb.path}
                    >
                      {breadcrumb.title}
                    </MuiLink>
                  ) : (
                    <Typography
                      key={index}
                      sx={{ color: "text.primary", fontWeight: 600 }}
                    >
                      {breadcrumb.title}
                    </Typography>
                  )
                )}
              </PageHeaderBreadcrumbs>
            ) : null}

            <PageContentHeader>
              {title ? <Typography variant="h4">{title}</Typography> : null}
              {actions ? <PageHeaderToolbar>{actions}</PageHeaderToolbar> : null}
            </PageContentHeader>
          </Stack>
        )}

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            ...contentSx,
          }}
        >
          {children}
        </Box>
      </Stack>
    </Container>
  );
}

PageContainer.propTypes = {
  actions: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ),
  children: PropTypes.node,
  title: PropTypes.string,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disableGutters: PropTypes.bool,
  containerSx: PropTypes.object,
  contentSx: PropTypes.object,
  fullHeight: PropTypes.bool,
};

export default PageContainer;