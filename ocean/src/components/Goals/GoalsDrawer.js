import React from 'react';
import { useRef, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import './GoalsDrawer.css'
import '../Tank/modal.css'

import ProgressBar from './ProgressBar'
import { updateUser, updateUserAddGoal } from '../../actions/users.js'

/*
GoalsDrawer, returns a button that expands a side drawer from the left that contains goal information
*
*
*/
export default function GoalsDrawer(props) {

  //user goal list
  const { goals, user, setUser, setGoals} = props;

  //  STATES

  const firstUpdateEdit = useRef(true); //state for first render
  const firstUpdateDetails = useRef(true); //state for first render


  //modal states
  const [openGoalModal, setOpenGoalModal] = React.useState(false);  //goal modal
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false); //details modal
  const [openEditModal, setOpenEditModal] = React.useState(false); //edit modal

  const [detailsModalContent, setDetailsModalContent] = React.useState({ //modal content for see details
    content: null
  })

  const [editModalContent, setEditModalContent] = React.useState({ //modal content for editing goals
    content: null
  })

  //drawer state
  const [state, setState] = React.useState({
    right: false
  });

  //goal states
  const [goalId, setGoalId] = React.useState(0); //incrementing unique goalIds

  const [newGoal, setNewGoal] = React.useState({  //new goal state
    id: goalId,
    title: '',
    tasks: [],
    totalTasksNum: 0,
    completedTasksNum: 0,
    completionPercent: 0,
    completed: false
  });

  const [editGoal, setEditGoal] = React.useState({ //edit goal state
    _id: null,
    id: null,
    title: '',
    tasks: [],
    totalTasksNum: 0,
    completedTasksNum: 0,
    completionPercent: 0,
    completed: false
  });


  const [detailsGoal, setDetailsGoal] = React.useState({ //details goal state
    _id: null,
    id: null,
    title: '',
    tasks: [],
    totalTasksNum: 0,
    completedTasksNum: 0,
    completionPercent: 0,
    completed: false
  });

  //useEffect for edit modal
  useEffect(() => {
    if (firstUpdateEdit.current) {
      firstUpdateEdit.current = false;
    } else {
     // do things after first render
      setEditContent();
    }
  }, [editGoal])

  //useEffect for details modal
  useEffect(() => {
    if (firstUpdateDetails.current) {
      firstUpdateDetails.current = false;
    } else {
      // do things after first render
      setDetailsContent();
    }
  }, [detailsGoal])


  //  HANDLERS

  //drawer handlers
  const toggleDrawer = (anchor, open) => (event) => { //toggleDrawer open
    setState({ ...state, [anchor]: open });
  };

  const refreshDrawerDelete = (anchor, goalId) => (event) => { //refresh drawer on delete
    deleteGoal(goalId);
    setState({ ...state, [anchor]: false });
    setState({ ...state, [anchor]: true });
  };

  const refreshDrawerAdd = (anchor, goal) => { //refresh drawer on add
    addGoal(goal);
    setState({ ...state, [anchor]: false });
    setState({ ...state, [anchor]: true });
  };

  //goal form handlers
  const handleFormGoalEntry = (e) => { //handle goal title form entry
    e.preventDefault();
    const value = e.target.value;

    setNewGoal({
      ...newGoal,
      [e.target.name]: value,
      id: goalId
    });
  };

  const handleFormTaskEntry = (e, taskId) => { //handle individual task entry
    e.preventDefault()
    const value = e.target.value;
    newGoal.tasks[taskId] = {id: taskId, task: value, completed: false};

    setNewGoal({
      ...newGoal,
      tasks: newGoal.tasks
    })
  };

  const handleFormSubmit = (e) => { //handle form submit
    e.preventDefault();

    newGoal.id = goalId;
    newGoal.totalTasksNum = newGoal.tasks.length; //set total number of tasks
    refreshDrawerAdd('right', newGoal); //refreshDrawer and add new goal to drawer
    setGoalId(goalId+1); //reset goal and tasks, increase goalId

    setNewGoal({
      ...newGoal,
      id: goalId,
      title: '',
      tasks: [],
      totalTasksNum: 0,
      completedTasksNum: 0,
      completionPercent: 0,
      completed: false
    });

    handleGoalModalClose();
  };

  //edit form handlers
  const handleFormGoalEdit = (e) => { //handle goal title form edit
    e.preventDefault()
    const value = e.target.value
    setEditGoal({
      ...editGoal,
      [e.target.name]: value,
    });
  };

  const handleFormTaskEdit = (e, taskId) => { //handle individual task edit
    e.preventDefault()
    const value = e.target.value;

    //if edit task
    if (editGoal.tasks[taskId].id != null)
      editGoal.tasks[taskId] = {id: editGoal.tasks[taskId].id, task: value, completed: false};
    //if adding a new task when editing, set id to be 1 greater than greatest id
    else {
      if (editGoal.tasks.length <= 1)
        editGoal.tasks[taskId] = {id: 0, task: value, completed: false};
      //minus 2 because array starts at 0 and account for currently updating task,
      else
        editGoal.tasks[taskId] = {id: editGoal.tasks[editGoal.tasks.length-2].id+1, task: value, completed: false}; 
    }
    
    setEditGoal({
      ...editGoal,
      tasks: editGoal.tasks
    })
  };

  const handleFormEditSubmit = (e) => { //handle edit form submit
    e.preventDefault();

    const goalToEdit = goals.find(function(goal, index) {
      if(goal._id == editGoal._id)
        return true;
    });
    
    goalToEdit.title = editGoal.title;
    goalToEdit.tasks = editGoal.tasks;
    goalToEdit.totalTasksNum = editGoal.tasks.length;
    goalToEdit.completedTasksNum = editGoal.completedTasksNum;
    
    if (goalToEdit.totalTasksNum == 0 || goalToEdit.completedTasksNum == 0)
      goalToEdit.completionPercent = 0;
    else
      goalToEdit.completionPercent = Math.round((editGoal.completedTasksNum/goalToEdit.totalTasksNum)*100);

    handleEditModalClose();

    //PUT request to handle edited content
    updateUser(user, user._id)

  };

  //form add task
  const addTask = (formType) => {

    if (formType == "create") {
      setNewGoal({
        ...newGoal,
        tasks: [...newGoal.tasks, {id: null, task: '', completed: false}]
      })
    }
    if (formType == "edit") {
      setEditGoal({
        ...editGoal,
        tasks: [...editGoal.tasks, {id: null, task: '', completed: false}],
      })
    }
  };

  //form delete task
  const handleFormTaskDelete = (taskId, formType) =>  { //handle task deletion in form
    if (formType == "create") {
      newGoal.tasks.splice(taskId, 1);

      setNewGoal({
        ...newGoal,
        tasks: newGoal.tasks
      })
    }
    if (formType == "edit") {
      if (editGoal.tasks[taskId].completed) {
        editGoal.completedTasksNum--;
      }
      editGoal.tasks.splice(taskId, 1);

      setEditGoal({
        ...editGoal,
        tasks: editGoal.tasks,
        totalTasksNum: editGoal.tasks.length
      });
    }
  }

  //modal handlers
  const handleGoalModalOpen = () => { //open goal modal
    setOpenGoalModal(true);
  };

  const handleGoalModalClose = () => { //close goal modal
    setNewGoal({  //refresh new goal state for form exit
      id: goalId,
      title: '',
      tasks: [],
      totalTasksNum: 0,
      completedTasksNum: 0,
      completionPercent: 0,
      completed: false
    });

    setOpenGoalModal(false);
  };

  const handleDetailsModalOpen = (goal) => { //open correct details modal
    setDetailsGoal({
      _id: goal._id,
      id: goal.id,
      title: goal.title,
      tasks: goal.tasks,
      totalTasksNum: goal.totalTasksNum,
      completedTasksNum: goal.completedTasksNum,
      completionPercent: goal.completionPercent,
      completed: goal.completed
    });

    setDetailsContent();
  };

  const setDetailsContent = () => { //set details content state, called by detail modal open handler
    setDetailsModalContent({content:seeDetailsModalContent(detailsGoal)});
    setOpenDetailsModal(true);
  }

  const handleDetailsModalClose = () => { //close details modal
    setOpenDetailsModal(false);
  };

  const handleEditModalOpen = (goal) => { //set current edit goal
    setEditGoal({
      _id: goal._id,
      id: goal.id,
      title: goal.title,
      tasks: goal.tasks.slice(0), //make a copy of array to modify
      totalTasksNum: goal.totalTasksNum,
      completedTasksNum: goal.completedTasksNum,
      completionPercent: goal.completionPercent,
      completed: goal.completed
    }); 
  }

  const setEditContent = () => { //set edit content state, called by edit modal open handler
    setEditModalContent({content:editGoalModalContent(editGoal)})
    setOpenEditModal(true);
  }

  const handleEditModalClose = () => { //close edit modal
    setOpenEditModal(false);
  }

  const handleCheckChange = (taskId) => {

    const goalToEdit = goals.find(function(goal, index) {
      if(goal._id == detailsGoal._id)
        return true;
    });

    const taskToEdit = goalToEdit.tasks.find(function(task, index) {
      if(task.id == taskId)
        return true;
    });

    if (taskToEdit.completed) 
      goalToEdit.completedTasksNum--;
    else
      goalToEdit.completedTasksNum++;

      taskToEdit.completed = !taskToEdit.completed;

    if (goalToEdit.completedTasksNum == 0 || goalToEdit.totalTasksNum == 0)
    goalToEdit.completionPercent = 0;
      else
    goalToEdit.completionPercent = Math.round((goalToEdit.completedTasksNum/goalToEdit.totalTasksNum)*100);

    //instant refresh modal
    handleDetailsModalOpen(goalToEdit);
    handleDetailsModalClose();

    //PUT request to save completed/non completed tasks and completion request
    updateUser(user, user._id)

  }

  //check for empty tasks
  function hasEmptyTaskTitle (goal) {
    
    for (var i=0 ; i < goal.tasks.length; i++) {
      if (goal.tasks[i].task == '') {
        return true;
      }
    }
    return false;
  }


  //  CONTENTS OF DRAWER AND MODALS

  /*
  * Drawer contents
  */
  const drawer = (anchor) => (
    <div className='goalsDrawer' >
      <div className='drawerContent'>

        <div className='drawerTitleDiv' >
          <h1>Your Goals</h1>
        </div>

        <div className='addGoalButtonDiv' >
          <Button onClick={handleGoalModalOpen} variant="outlined" color="primary">Add Goal</Button>
          <Modal open={openGoalModal} onClose={handleGoalModalClose} >
            {addGoalModalContent(newGoal)}
          </Modal>
        </div>

        <div className='goalsList' >

        {goals.length == 0 ? <p>You currently have no goals. Add a goal to keep track of your work!</p>: null}

        {goals.map((goal) => (
        <div>
          {!goal.completed ? 

            <div className='goalIndividualContainer'>
              <div className = 'goalIndividualContents'>
                <div className = 'goalTitleDiv'>
                  <p className = 'bold' > {`${goal.title}`}</p>
                </div>
                <div className = 'rightButton'>
                  <IconButton color="primary" onClick={() => handleEditModalOpen(goal)} >
                    <EditOutlinedIcon />
                  </IconButton>

                </div>
                
                <ProgressBar completed={goal.completionPercent} />

                <div className = 'leftButton'>     
                  <Button onClick={() => handleDetailsModalOpen(goal)} variant="outlined" color="primary">Check Tasks</Button>
                </div>              
                <Button className = 'rightButton' variant="outlined" color="primary" onClick={refreshDrawerDelete(anchor, goal._id) }>Finished!</Button>
                      
              </div>

            </div>

          : null}
        </div>  
        ))}
        <Modal open={openDetailsModal} onClose={handleDetailsModalClose} >
          {detailsModalContent.content}
        </Modal>

        <Modal open={openEditModal} onClose={handleEditModalClose} >
          {editModalContent.content}
        </Modal>

        </div>
      </div>
    </div>
  );


  /*
  / Add Goal Content
  */
  const addGoalModalContent = (goal) => (
      <div className = 'modalContainer'>
        <div className = 'modalContent'>
          <h2 >Add a Goal!</h2>
          <form className='addGoalForm'>

            
            <TextField className='formTextFieldGoal'
              label="Enter a Goal"
              name="title"
              helperText="Please enter a name for your goal"
              value={goal.title}
              onChange = {handleFormGoalEntry}
              >      

            </TextField>
            <div className ='taskTitleAndButton'>
              <div className='tasksTitleDiv'>
                <h2 >Add Tasks!</h2>
              </div>
    
              <div className='addAnotherTaskButtonDiv'>
                <IconButton color="primary" onClick={() => addTask("create")}>
                  <AddIcon />
                </IconButton>
              </div>
            </div>

            {newGoal.tasks.map((task, index) => (
              <div key = {index}>
                <TextField className='formTextFieldTask'
                  id={index}
                  label="Add a Task"
                  name="task"
                  helperText="Please enter a name for your task"
                  value={task.task}
                  onChange = {(e)=>handleFormTaskEntry(e, index)}
                  >
                </TextField>
                <IconButton color="default" onClick={() => handleFormTaskDelete(index, "create")} className='rightButton'>
                  <ClearIcon />
                </IconButton>
                
              </div>
            ))}

            <p></p>
            <Button type="submit"
                    variant="outlined"
                    color="primary"
                    onClick={handleFormSubmit}
                    className='formSubmitButton'
                    disabled={(hasEmptyTaskTitle(newGoal)) 
                                || (newGoal.title == "" && newGoal.tasks.length == 0)}>
              Create Goal
            </Button>
            <p></p>

          </form>
        </div>
      </div>
  )


  /*
  * See Details Content
  */
  const seeDetailsModalContent = (goal) => (
    <div className = 'modalContainer'>
      <div className = 'modalContent'>
        <div className = 'seeDetailsGoalTitle'>
          <h1>{`${goal.title}`}</h1>
        </div>
        <h2>Tasks</h2>
        {goal.tasks.map((task) => (
          <div>
            <input type="checkbox" id={task.id} name={task.task} value={task.task} defaultChecked={task.completed} onClick = {() => handleCheckChange(task.id)}/>
            <label for={task.task}>{`${task.task}`}</label>

          </div>       
        ))}
        <p></p>
        <ProgressBar completed={goal.completionPercent}/>

      </div>
    </div>
  )


  /**
   * Edit goal content
   */
  const editGoalModalContent = (goal) => (
    <div className = 'modalContainer'>
      <div className = 'modalContent'>
        <h2 >Goal Title: </h2>

        <form className='addGoalForm'>
          <TextField className='formTextFieldGoal'
            label="Enter a Goal"
            name="title"
            helperText="Please enter a name for your goal"
            value={goal.title}
            onChange = {handleFormGoalEdit}
            >      
          </TextField>
          <div className ='taskTitleAndButton'>
            <div className='tasksTitleDiv'>
              <h2 >Current Tasks: </h2>
            </div>
  
            <div className='addAnotherTaskButtonDiv'>
              <IconButton color="primary" onClick={() => addTask("edit")}>
                <AddIcon />
              </IconButton>
            </div>
          </div>

          {goal.tasks.map((task, index) => (
            <div key = {index}>
              <TextField className='formTextFieldTask'
                id={index}
                label="Add a Task"
                name="task"
                helperText="Please enter a name for your task"
                value={task.task}
                onChange = {(e)=>handleFormTaskEdit(e, index)}
                >
              </TextField>
              <IconButton color="default" onClick={() => handleFormTaskDelete(index, "edit")} className='rightButton'>
                <ClearIcon />
              </IconButton>  
            </div>
          ))}

          <p></p>
          <Button type="submit"
                  variant="outlined"
                  color="primary"
                  onClick={handleFormEditSubmit}
                  className='formSubmitButton'
                  disabled={hasEmptyTaskTitle(goal) || (!goal.title)}>
            Edit Goal
          </Button>
          <p></p>

        </form>
      </div>
    </div>
  )


  //  HELPER FUNCTIONS

  /*
  * addGoal to mem goal array
  */
  function addGoal(goal) {
    //goals.push(goal)

    // POST request to add goal
    updateUserAddGoal(goal, user._id)
    .then((result) => {
      console.log(result.goals)
      setUser(result)
      }
    )

  }

  /*
  * change goal to complete
  */
  function deleteGoal(goalId) {

    const goal = goals.find(function(goal, index) {
      if(goal._id == goalId)
        return true;
    });
    
    goal.completed = true;
    //const index = goals.indexOf(goal);
    //goals.splice(index, 1);

    const newGoalsForRefresh = goals.slice(0);

    props.refreshGoals(newGoalsForRefresh);

    //DELETE request to delete goal
    updateUser(user, user._id)
  }
  

  //  RETURN

  /*
  /return button and sideDrawer
  */
  return (
    <div className = 'goalsButtonDiv'>
      {['See Your Goals'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button id = "seeYourGoalsButton" onClick={toggleDrawer(anchor, true)} variant="outlined" color="primary">{anchor} </Button>
          <Drawer anchor={'right'} open={state[anchor]} onClose={toggleDrawer(anchor, false)} >
            {drawer(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}