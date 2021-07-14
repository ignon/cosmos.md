const Dropdown = ({ button, content, className }) => {
  return (
    <div className={className}>
      <div className='dropdown'>
        {button}
        <div className='dropdown-content'>
          {content}
        </div>
      </div>
    </div>
  )
}

export default Dropdown