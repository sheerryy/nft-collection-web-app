import { createStyles } from '@material-ui/core';

const HomeStyle = () => createStyles({
  mainContainer: {
    backgroundImage: 'url("/assets/images/bg-image.png"), linear-gradient(0deg, rgba(34,129,195,1) 16%, rgba(45,154,253,1) 50%)',
    backgroundColor: 'black',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
});

export default HomeStyle;
