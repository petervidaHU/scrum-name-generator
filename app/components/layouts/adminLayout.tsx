/*
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@mui/material';

const inter = Inter({ subsets: ['latin'] })



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar
        className="p-6 drop-shadow-md"
        fluid
        rounded
      >
        <Navbar.Toggle />
        <Navbar.Collapse
        >
          <Navbar.Link
            active
            href="/admin/names/"
          >
            <p>
              Names
            </p>
          </Navbar.Link>
          <Navbar.Link
            active
            href="/admin/tages/"
          >
            <p>
              Tages
            </p>
          </Navbar.Link>
          <Navbar.Link
            active
            href="/admin/createNew/"
          >
            <p>
              Create new
            </p>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <main >{children}</main>
    </>
  )
}
*/

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
  title: 'test openai',
  link: 'admin/create-new',
},
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar({children}: {children: React.ReactNode}) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

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


        </Toolbar>
      </Container>
    </AppBar >
    {children}
    </>
  );
}
export default ResponsiveAppBar;