import React from 'react';
import {Breadcrumbs} from '@material-ui/core';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {withRouter} from 'react-router-dom';

// https://www.youtube.com/watch?v=n9kn8yQPC4E

const BreadSlices = (props) => {
  const {
    history,
    location: {pathname},
  } = props;
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {pathnames.length > 0 ?
        (<Link onClick={() => history.push('/')}>Market Place</Link>) :
        (<Typography>Market Place</Typography>)}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={name}>{name}</Typography>
        ) : (
          <Link key={name} onClick={() => history.push(routeTo)}>
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default withRouter(BreadSlices);
