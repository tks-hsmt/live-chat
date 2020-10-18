import React from 'react';
import MCard from '@material-ui/core/Card';
import MCardContent from '@material-ui/core/CardContent';
import MCardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';

type Props = {
  title: string;
  subTitle?: string;
  className?: string;
}

const Card: React.FC<Props> = props => {
  const { title, subTitle, className, children } = props;
  const classes = useStyles();
  return (
    <MCard className={`${classes.root} ${className}`}>
      <MCardContent>
        <Box>
          <Typography component='h5' variant='h5' className={classes.text}>
            {title}
          </Typography>
          <Typography color='textSecondary' className={classes.text}>
            {subTitle}
          </Typography>
        </Box>
      </MCardContent>
      {children && <MCardActions>{children}</MCardActions>}
    </MCard>
  );
}

export default Card;
