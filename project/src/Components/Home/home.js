import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css';
import 'animate.css';

function App() {
  const [meals, setMeals] = useState([]);
  const [weeks, setWeeks] = useState({ week1: [], week2: [], week3: [], week4: [] });
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState([]);

  useEffect(() => {
    axios.get('https://dummyjson.com/recipes')
      .then(response => {
        if (Array.isArray(response.data.recipes)) {
          setMeals(response.data.recipes);
        } else {
          console.error('Unexpected response format:', response.data);
          setMeals([]);
        }
      })
      .catch(error => console.error('Error fetching meals:', error));
  }, []);

  const addToWeek = (meal, week) => {
    if (!weeks[week].find(m => m.id === meal.id)) {
      setWeeks(prevWeeks => ({
        ...prevWeeks,
        [week]: [...prevWeeks[week], meal],
      }));
    }
  };

  const removeFromWeek = (meal, week) => {
    setWeeks(prevWeeks => ({
      ...prevWeeks,
      [week]: prevWeeks[week].filter(m => m.id !== meal.id),
    }));
  };

  const handleCardClick = (mealId) => {
    setSelectedMealId(mealId);
  };

  const handleAddToWeekClick = () => {
    const meal = meals.find(m => m.id === selectedMealId);
    if (meal) {
      setIsDialogOpen(true);
    }
  };

  const handleWeekButtonClick = (week) => {
    setSelectedWeeks(prevSelectedWeeks =>
      prevSelectedWeeks.includes(week)
        ? prevSelectedWeeks.filter(w => w !== week)
        : [...prevSelectedWeeks, week]
    );
  };

  const handleSaveClick = () => {
    const meal = meals.find(m => m.id === selectedMealId);
    if (meal) {
      selectedWeeks.forEach(week => addToWeek(meal, week));
    }
    setIsDialogOpen(false);
    setSelectedWeeks([]);
    setSelectedMealId(null); 
  };

  const renderAllMeals = () => (
    <div className="meal-container">
      <h2>All Meals</h2>
      <div className="meal-grid">
        {meals.map(meal => (
          <div key={meal.id} className={`card ${selectedMealId === meal.id ? 'selected' : ''}`} onClick={() => handleCardClick(meal.id)}>
            <img src={meal.image} alt={meal.name} />
            <div className="card-content">
              <div className="card-title">{meal.name}</div>
              <div className="card-details">
                <p>{meal.instructions}</p>
                <div className="card-rating">
                  <div><strong>Cuisine:</strong> {meal.cuisine}</div>
                  <div>
                    <strong>Rating:</strong>
                    {[...Array(Math.round(meal.rating))].map((_, i) => (
                      <span key={i} className="star-rating">&#9733;</span>
                    ))}
                    ({meal.rating} / 5.0)
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeekMeals = (week) => (
    <div className="meal-container">
      <h2>Week {week.slice(-1)}</h2>
      <div className="meal-grid">
        {weeks[week].map(meal => (
          <div key={meal.id} className={`card ${selectedMealId === meal.id ? 'selected' : ''}`} onClick={() => handleCardClick(meal.id)}>
            <img src={meal.image} alt={meal.name} />
            <div className="card-content">
              <div className="card-title">{meal.name}</div>
              <div className="card-details">
                <p >{meal.instructions}</p>
                <div className="card-rating">
                  <div><strong>Cuisine:</strong> {meal.cuisine}</div>
                  <div>
                    <strong>Rating:</strong>
                    {[...Array(Math.round(meal.rating))].map((_, i) => (
                      <span key={i} className="star-rating">&#9733;</span>
                    ))}
                    ({meal.rating} / 5.0)
                  </div>
                </div><br/>
                <button className='animate__heartBeat button' onClick={() => removeFromWeek(meal, week)}>Remove from Week</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <header>
        <h1>Optimized Your Meal</h1>
        <h6>Select Meal to Add in Week. You will be able to edit, modify and change the Meal weeks</h6>
        <nav>
          <div className='navbar-buttons'>
          <button className={`animate__heartBeat button-nav ${currentTab === 'all' ? 'selected' : ''}`} onClick={() => setCurrentTab('all')}>All Meals</button>
          <button className={`animate__heartBeat button-nav ${currentTab === 'week1' ? 'selected' : ''}`} onClick={() => setCurrentTab('week1')}>Week 1</button>
          <button className={`animate__heartBeat button-nav ${currentTab === 'week2' ? 'selected' : ''}`} onClick={() => setCurrentTab('week2')}>Week 2</button>
          <button className={`animate__heartBeat button-nav ${currentTab === 'week3' ? 'selected' : ''}`} onClick={() => setCurrentTab('week3')}>Week 3</button>
          <button className={`animate__heartBeat button-nav ${currentTab === 'week4' ? 'selected' : ''}`} onClick={() => setCurrentTab('week4')}>Week 4</button>
          <button className='animate__heartBeat button right-button' onClick={handleAddToWeekClick} disabled={!selectedMealId}>Add to week</button>
          </div>  </nav>
      </header>
      <div className='week-orders'><h2>Week Orders</h2>
      </div>
      <main >
        {currentTab === 'all' && renderAllMeals()}
        {currentTab !== 'all' && renderWeekMeals(currentTab)}
      </main>
      {isDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <h3>Select Weeks to Add Meal</h3>
            <div className="button-group">
              <button
                className={`week-button ${selectedWeeks.includes('week1') ? 'selected' : ''}`}
                onClick={() => handleWeekButtonClick('week1')}
              >
                Week 1
              </button>
              <button
                className={`week-button ${selectedWeeks.includes('week2') ? 'selected' : ''}`}
                onClick={() => handleWeekButtonClick('week2')}
              >
                Week 2
              </button>
              <button
                className={`week-button ${selectedWeeks.includes('week3') ? 'selected' : ''}`}
                onClick={() => handleWeekButtonClick('week3')}
              >
                Week 3
              </button>
              <button
                className={`week-button ${selectedWeeks.includes('week4') ? 'selected' : ''}`}
                onClick={() => handleWeekButtonClick('week4')}
              >
                Week 4
              </button>
            </div>
            <div className='dialog-button'>
              <button className='animate__heartBeat button' onClick={handleSaveClick}>Save</button>
              <button className='animate__heartBeat button' onClick={() => setIsDialogOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
