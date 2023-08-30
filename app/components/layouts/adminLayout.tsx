import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/rootReducer';
import { toggleCommentsOn } from '@/app/features/comments/commentsOnSlice';

const pages = [{
  title: 'names',
  link: 'admin/names',
},
{
  title: 'tags',
  link: 'admin/tages',
}, {
  title: 'manage-prompts',
  link: 'admin/manage-prompts',
}, {
  title: 'manage-parameters',
  link: 'admin/manage-parameters',
},
{
  title: 'manage-results',
  link: 'admin/manage-results',
},
{
  title: 'test openai',
  link: 'admin/create-new',
},
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar({ children }: { children: React.ReactNode }) {
  const commentsOn = useSelector((state: RootState) => state.comments.value);
  const dispatch = useDispatch();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleToggleComments = () => {
    dispatch(toggleCommentsOn());
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap

              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 500,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              POC_versioner
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    component="a"
                    textAlign="center"
                    href="/admin/names/"
                  >
                    names
                  </Typography>
                </MenuItem>

              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 500,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              POC_versioner
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link key={page.title} href={`/${page.link.toLowerCase()}`} passHref>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
            </Box>

            <Tooltip title="Show notes for future improvements">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={commentsOn}
                      color='secondary'
                      onChange={handleToggleComments}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Future improvements"
                />
              </FormGroup>
            </Tooltip>

          </Toolbar>
        </Container>
      </AppBar >
      {children}
    </>
  );
}
export default ResponsiveAppBar;