import React, { FC } from 'react';
import * as styles from './App.css';

console.log(typeof process.env.FOG_NAME, process.env.NODE_ENV);

const App: FC = () => {
  return <div className={styles.container}>test app</div>;
};

export default App;
