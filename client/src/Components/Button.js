const Button = ({ Icon, onClick }) => {
  return (
    <button onClick={onClick}>
      <Icon />
    </button>
  )
}


export default Button