import React, { useEffect, useState } from 'react'
import './Home.css'
import useCounter from '../hook/counter';
import useCrud from '../hook/crud';
import AddUserModal from '../components/AddUserModal';
import UserCard from '../components/UserCard';
import VSButton from '../components/Button';
import TimerComponent from '../components/TimerComponent';

const Home = (props) => {
  const { title, description, button } = props.homePageData;

  const { count, increment, decrement } = useCounter(0);

  const { data, addData, deleteData, handleInputChange, loadTodoItem, userInput } = useCrud();
  console.log("data", data)
  useEffect(() => {
    loadTodoItem();
  }, []);

  const [showAddUser, setShowAddUser] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState(0);

  const openAddUser = () => setShowAddUser(true);

  const closeAddUser = () => setShowAddUser(false);

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!userInput.name.trim()) return;
    addData();
    setShowAddUser(false);
  };

  const onChangeTab = (type) => {
    switch (type) {
      case 0:
        setIsActiveTab(0);
        break;
      case 1:
        setIsActiveTab(1);
        break;
    }
  }

  const TODOComponent = () => {
    return (
      <>
        <div className="home__panel-head">
          <div>
            <h2 className="home__panel-title">People</h2>
            <p className="home__panel-meta">
              {data.length} {data.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
          <VSButton title={"Add User"} onClick={openAddUser} />
        </div>

        <div className="home__list">
          {data.length === 0 ? (
            <div className="home__empty">
              <p>No users yet</p>
              <VSButton title={"Add Your First User"} onClick={openAddUser} />
            </div>
          ) : (
            data.map((item, index) => (
              <UserCard key={index} item={item} deleteData={deleteData} />
            ))
          )}
        </div>

        <div className="home__counter">
          <span className="home__counter-label">Practice counter</span>
          <div className="home__counter-controls">
            <button type="button" className="home__btn home__btn--ghost" onClick={decrement} aria-label="Decrement">
              −
            </button>
            <span className="home__counter-value" aria-live="polite">{count}</span>
            <button type="button" className="home__btn home__btn--ghost" onClick={increment} aria-label="Increment">
              +
            </button>
          </div>
        </div>
      </>

    )
  }

  return (
    <section className="home" id="Home">
      <div className="home__backdrop" aria-hidden="true" />

      <div className="home__inner">
        <header className="home__hero">
          <p className="home__eyebrow">Portfolio</p>
          <h1 className="home__title">{title}</h1>
          <p className="home__desc">{description}</p>
          <VSButton title={button} />
        </header>

        <div className="home__panel">
          <div className='tab__wrapper'>
            <VSButton title={"TODO COMPONENT"} onClick={() => { onChangeTab(0) }} isActive={isActiveTab === 0} />
            <VSButton title={"TIMER COMPONENT"} onClick={() => { onChangeTab(1) }} isActive={isActiveTab === 1} />
          </div>
          {
            isActiveTab === 0 ? <TODOComponent /> : <TimerComponent />
          }
        </div>
      </div>

      {showAddUser && (
        <AddUserModal closeAddUser={closeAddUser} handleSubmitUser={handleSubmitUser} handleInputChange={handleInputChange} userInput={userInput} />
      )}
    </section>
  )
}

export default Home
