# RULE

# LOCKS

# LOOKUPS

# SCHEDULER

# WEBSOCKET 
 Integrate websocket in application for realtime updates and broadcast of messages
 ## NOTIFICATION
  - Add a notification table with id, detail, audience (enum of USER or GROUP), status (Read,Unread), owner(User or group_id)
  - on new notification a db entry should be made and notification count should be updated real time for all the active application user
  - option for user to delete the notification
  - notification clears itself if read after 30 days 
 ## TASK 
  - Add a task table with id, detail, audience (enum of USER or GROUP), assigned date, completed date, priority, owner ...
  - A task is assigned automatically from Rule, could be to approve a workflow, do some work etc 
  - A task will have a priority assigned 

# USER
 ## Add Ability to add User Group 
  ### Add groups 
   - Table with id, group_name, description, group_leader (has_one user relation),   has_many user relation
   - UI to add Group 
   - UI to assign user to group and pick a leader
  ### Add user_groups 
   - table with user_id and group_id 

