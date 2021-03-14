import React from 'react';
import Layout from 'components/Layout';
import DatePicker from 'components/DatePicker';

const Home = () => {
  return (
    <Layout>
      <DatePicker
        onChange={(d) => {console.log(d)}}
      />
    </Layout>
  )
}

export default Home