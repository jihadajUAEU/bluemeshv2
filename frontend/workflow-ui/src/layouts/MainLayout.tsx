import { FC } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppShell,
  Text,
  Button,
  NavLink,
  Box,
  Title,
  useMantineTheme,
  Container,
  Stack,
  Paper,
  Group,
  rem,
} from '@mantine/core';
import { useWorkflowLoading } from '../hooks/useAppStore';

const NAVBAR_WIDTH = rem(250);
const HEADER_HEIGHT = rem(60);

const MainLayout: FC = () => {
  const theme = useMantineTheme();
  const location = useLocation();
  const isLoading = useWorkflowLoading();

  const navItems = [
    { label: 'Workflows', path: '/workflows' },
    { label: 'Create New', path: '/workflows/new' },
  ];

  return (
    <AppShell
      padding="md"
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: 'sm',
      }}
    >
      <AppShell.Navbar p="md">
        <Stack gap="sm">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              component={Link}
              to={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Header bg={theme.colors.blue[7]}>
        <Container h={HEADER_HEIGHT}>
          <Group justify="space-between" h="100%">
            <Title order={3} c="white">
              Workflow Platform
            </Title>
            <Button
              component={Link}
              to="/workflows/new"
              variant="filled"
              color="gray"
            >
              Create Workflow
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Paper shadow="xs" p="md" style={{ height: '100%', position: 'relative' }}>
          {isLoading && (
            <Box
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <Text size="xl">Loading...</Text>
            </Box>
          )}
          <Outlet />
        </Paper>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
