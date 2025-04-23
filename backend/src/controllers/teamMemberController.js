const Task = require("../models/Task");

const updateTask = async (req, res) => {
    try{
        const taskId = req.params.id;
        const {status, progress} = req.body;

        let task = await Task.findById(taskId);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        if(progress !== undefined){
            task.progress = progress;

            if(!status){
                if(progress>0 && progress<=100){
                    task.status = "In Progress";
                }
            }
        }

        if(status){
            task.status = status;
        }

        await task.save();
        res.status(201).json({message: "Task updated successfully", task});
    }
    catch(err){
        res.status(500).json({ message: "Server Error", err });
    }
}

const submitTask = async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });
  
      if (req.user.role !== "Team Member") {
        return res.status(403).json({ message: "Access denied" });
      }
  
      task.status = "Completed";
      await task.save();
  
      res.status(200).json({ message: "Task submitted successfully", task });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  };
  

module.exports = {updateTask, submitTask};