import React from 'react'

interface iLoader {
  loading: boolean,
};

const Loader: React.FC<iLoader> = ({ loading }) => {
  return (
    <>
      {loading ? (<div>loading</div>) : null}
    </>
  )
}

export default Loader;
