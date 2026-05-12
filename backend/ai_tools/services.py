def build_user_story_response(validated_data):
    project_title = validated_data["project_title"]
    objective = validated_data["objective"]
    feature = validated_data["feature"]
    feature_lower = feature.lower()

    categories = {
      "authentication": ["auth", "login"]
    }
     # ['auth', 'login', 'team', 'members', 'deadline', 'due date', 'file', 'upload', 'board', 'kanban', 'status', 'comment']
    
   