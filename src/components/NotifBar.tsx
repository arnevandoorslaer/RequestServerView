const NotifBar = ({ song, error, setSelected, setError }) => {
  setTimeout(() => {
    setSelected(null);
    setError(null);
  }, 5000);

  return (
    <>
      {song && song.title && (
        <div className='alert alert-success mt-3'>ADDED {song.title}</div>
      )}
      {error && (
        <div className='alert alert-danger mt-3'>Something went wrong...</div>
      )}
    </>
  );
};

export default NotifBar;
