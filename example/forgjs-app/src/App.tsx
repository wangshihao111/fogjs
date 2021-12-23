import React, { FC } from 'react';
import { Button } from 'antd';
import * as styles from './App.css';

console.log(process.env.NODE_ENV);

const App: FC<any> = () => {
  return (
    <div className={styles.container}>
      <Button>test button</Button>
    </div>
  );
};

export default App;
