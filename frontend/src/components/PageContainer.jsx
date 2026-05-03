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
import { Link } from "react-router-dom";

// ─── Design Tokens (matches Header + ProjectDetails) ──────────────
const BLUE       = "#1B6FEB"
const BLUE_LIGHT = "#EBF2FF"

// ─── Styled Components ────────────────────────────────────────────
const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(0, 0, 0.5),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: "0 2px",
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
    flexWrap: "wrap",
  },
}))

const PageContentHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  marginBottom: theme.spacing(2),
}))

const PageHeaderToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  marginLeft: "auto",
  flexWrap: "wrap",
}))

// ─── Component ────────────────────────────────────────────────────
function PageContainer(props) {
  const {
    children,
    breadcrumbs,
    title,
    actions      = null,
    maxWidth     = "lg",
    disableGutters = false,
    containerSx  = {},
    contentSx    = {},
    fullHeight   = false,
  } = props

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
        // no background — inherits from Layout so dark mode works
        px: disableGutters ? 0 : { xs: 2, sm: 3 },
        pb: 4,
        ...containerSx,
      }}
    >
      {/* Header section — only renders if there is content */}
      {(breadcrumbs || title || actions) && (
        <Stack spacing={0} mb={2}>
          {breadcrumbs && breadcrumbs.length > 0 && (
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
                    to={breadcrumb.path}
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: BLUE,
                      "&:hover": { color: "#1358C4" },
                    }}
                  >
                    {breadcrumb.title}
                  </MuiLink>
                ) : (
                  <Typography
                    key={index}
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "text.primary",   // ← theme-aware, works in dark mode
                    }}
                  >
                    {breadcrumb.title}
                  </Typography>
                )
              )}
            </PageHeaderBreadcrumbs>
          )}

          <PageContentHeader>
            {title && (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",        // ← theme-aware
                  letterSpacing: "-0.3px",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
            )}
            {actions && (
              <PageHeaderToolbar>{actions}</PageHeaderToolbar>
            )}
          </PageContentHeader>
        </Stack>
      )}

      {/* Page content */}
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
    </Container>
  )
}

PageContainer.propTypes = {
  actions:        PropTypes.node,
  breadcrumbs:    PropTypes.arrayOf(
    PropTypes.shape({
      path:  PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ),
  children:       PropTypes.node,
  title:          PropTypes.string,
  maxWidth:       PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disableGutters: PropTypes.bool,
  containerSx:    PropTypes.object,
  contentSx:      PropTypes.object,
  fullHeight:     PropTypes.bool,
}

export default PageContainer
