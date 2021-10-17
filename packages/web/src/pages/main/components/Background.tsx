const Background = () => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          background: "linear-gradient(to bottom right, #B5D4E4, #DCECF6)",
          height: "100vh",
          width: "100vw",
          zIndex: -2,
          overflowX: "hidden",
        }}
      />
      <div
        style={{
          position: "fixed",
          borderTop: "100vh solid #F6F8FB",
          borderLeft: "0px solid transparent",
          borderRight: "10vw solid transparent",
          height: "0",
          width: "50vw",
          left: 0,
          zIndex: -1,
          overflowX: "hidden",
        }}
      />
    </>
  )
}

export default Background
