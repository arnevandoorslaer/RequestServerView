const NotifBar = ({ song, error, setSelected, setError }) => {
  setTimeout(() => {
    setSelected(null);
    setError(null);
  }, 5000);

  return (
    <>
      {song && song.title && (
        <div className='alert alert-success'>ADDED {song.title}</div>
      )}
      {error && (
        <div className='alert alert-danger'>Something went wrong...</div>
      )}
    </>
  );
};

export default NotifBar;
