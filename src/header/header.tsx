import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TodayIcon from '@material-ui/icons/Today';
import ListIcon from '@material-ui/icons/List';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import './header.css';
export type HeaderProps = unknown;

export const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <div className="toolbar-contents-wrapper">
          <div>
            <IconButton component={Link} to="/" edge="start" color="inherit">
              <TodayIcon />
              <Typography variant="h6">Today</Typography>{' '}
            </IconButton>
            <IconButton component={Link} to="/backlog" color="inherit">
              <ListIcon />
              <Typography variant="h6" color="inherit">
                Backlog
              </Typography>
            </IconButton>
          </div>
          <div>
            <IconButton
              component={Link}
              to="/settings"
              color="inherit"
              edge="end"
            >
              <SettingsIcon />
            </IconButton>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};
