import React, { FunctionComponent, ReactElement } from 'react';
import { Todo } from '../types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export interface TodoCardAction {
  name: string;
  execute: () => void;
}

export interface TodoProps {
  todo: Todo;
  actions?: TodoCardAction[];
}

export const TEST_IDS = {
  EXPAND_CARD_BUTTON: 'todo-card-show-more-icon',
  ACTION_MENU_ICON_BUTTON: 'todo-card-action-menu-icon-button',
};

export const TodoCard: FunctionComponent<TodoProps> = (props: TodoProps) => {
  const todo = props.todo;
  const actions: TodoCardAction[] = props.actions || [];

  const subheader = `p: ${todo.priority}, est: ${todo.estimate}m`;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded((expanded) => !expanded);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const todoActionMenu =
    actions.length === 0 ? null : (
      <>
        <IconButton
          aria-label="settings"
          onClick={handleMenuClick}
          data-testid={TEST_IDS.ACTION_MENU_ICON_BUTTON}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {actions.map(createTodoActionMenuItem)}
        </Menu>
      </>
    );

  return (
    <Card>
      <CardHeader
        title={todo.title}
        subheader={subheader}
        action={todoActionMenu}
      ></CardHeader>
      <CardActions>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          data-testid={TEST_IDS.EXPAND_CARD_BUTTON}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{todo.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

function createTodoActionMenuItem(action: TodoCardAction): ReactElement {
  return (
    <MenuItem key={action.name} onClick={action.execute}>
      {action.name}
    </MenuItem>
  );
}

export default TodoCard;
