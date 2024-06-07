const express = require('express');
const router = express.Router();

let tasks = [
  { id: 1, title: "A", description: "need improvements" },
  { id: 2, title: "B", description: "good progress" },
  { id: 3, title: "C", description: "keep up the good work " }
];


const sortTasks = (tasks, sortBy, order) => {
  if (!sortBy) return tasks;
  return tasks.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return order === 'desc' ? 1 : -1;
    if (a[sortBy] > b[sortBy]) return order === 'desc' ? -1 : 1;
    return 0;
  });
};


const filterTasks = (tasks, filterBy, filterValue) => {
  if (!filterBy || !filterValue) return tasks;
  return tasks.filter(task => task[filterBy].toLowerCase().includes(filterValue.toLowerCase()));
};

router.get('/', (req, res) => {
  let { page = 1, pageSize = 10, sortBy, order = 'asc', filterBy, filterValue } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  // Sorting
  let sortedTasks = sortTasks(tasks, sortBy, order);

  // Filtering
  let filteredTasks = filterTasks(sortedTasks, filterBy, filterValue);

  // Pagination
  const totalTasks = filteredTasks.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  res.status(200).json({
    page,
    pageSize,
    totalTasks,
    totalPages: Math.ceil(totalTasks / pageSize),
    tasks: paginatedTasks
  });
});

router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).send('Task not found');
  res.status(200).json(task);
});

router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send('Title and description are required');
  }
  const task = {
    id: tasks.length + 1,
    title,
    description
  };
  tasks.push(task);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).send('Task not found');

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send('Title and description are required');
  }
  task.title = title;
  task.description = description;
  res.status(200).json(task);
});

router.delete('/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).send('Task not found');

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

module.exports = router;
