def generate_story_with_rules(validated_data):
  project_title = validated_data["project_title"]
  objective = validated_data["objective"]
  feature = validated_data["feature"]
  feature_lower = feature.lower()
  objective_key = objective.lower()

  categories = {
    "authentication": ["auth", "login", "signin", "signup", "password", "account", "permission", "access"],
    "team management": ["team", "member", "role", "invite", "collaborate", "user management"],
    "taskboard": ["board", "kanban", "task", "status", "workflow", "column", "drag"],
    "discussion": ["comment", "discussion", "reply", "message", "chat", "feedback"],
    "dashboard": ["dashboard", "analytics", "report", "summary", "chart", "metric", "stats"],
    "deadlines": ["deadline", "due date", "calendar", "schedule", "reminder", "timeline"],
    "file management": ["file", "upload", "attachment", "document", "image", "media"],
    "notifications": ["notification", "alert", "email", "push", "remind"],
  }

  SEEDED_OBJECTIVE_RESPONSES = {
    "saturday errand day": {
        "completion_checks": [
            "Errands are grouped by location or store.",
            "Shopping items are listed before leaving.",
            "Time-sensitive stops are completed first."
        ],
        "suggested_tasks": [
            "Create grocery shopping list.",
            "Group errands by driving route.",
            "Confirm store hours before leaving.",
            "Assign household member responsible for each stop."
        ]
    },

    "household chores": {
        "completion_checks": [
            "Each chore has a clear owner.",
            "High-priority home maintenance is completed first.",
            "Recurring chores are tracked for next week."
        ],
        "suggested_tasks": [
            "List weekly cleaning tasks.",
            "Assign chores by room or responsibility.",
            "Mark urgent maintenance items.",
            "Review unfinished chores at the end of the week."
        ]
    },

    "stark tower upgrades": {
        "completion_checks": [
            "Upgrade areas are identified and prioritized.",
            "Safety and infrastructure risks are reviewed.",
            "Completed upgrades are verified before sign-off."
        ],
        "suggested_tasks": [
            "Audit current tower systems.",
            "Prioritize technology upgrades.",
            "Create safety checklist for infrastructure work.",
            "Schedule review with the project owner."
        ]
    }
  }

  CATEGORY_RESPONSES = {
    "authentication": {
      "completion_checks": [
        "Users can login with name and passed",
        "Users can logout and log back in",
        "Invalid credentials will return an error message",
        "Authenticated users can access protected features"
      ],
      "suggested_tasks": [
        "Design the login form",
        "Create backend authentication endpoints",
        "Validate credentials and invalid credentials",
        "Create error handling",
        "Add session tokens and token refresh handling",
        "Add authentication layer to protected pages"
        "Create a user registration page"
      ]
    },
    "team management": {
      "completion_checks": [
        "Users can be added to a team or deleted from a team.",
        "Teams can be added by using a Team form",
        "Users can leave a team and join another Team"
      ],
      "suggested_tasks": [
        "Create a team registration form",
        "Create button on dashboard to add a new Team",
        "Build team model and endpoints for backend",
        "Create a flow for users to View Team members"
      ]
    },
    "taskboard": {
      "completion_checks": [
        "Tasks can move between workflow columns.",
        "Users can clearly see task status.",
        "The board updates correctly after changes."
      ],
      "suggested_tasks": [
        "Create draggable task cards.",
        "Build workflow columns.",
        "Add task status update logic.",
        "Test drag-and-drop interactions."
      ]
    },
    "discussion": {
      "completion_checks": [],
      "suggested_tasks": []
    },
    "dashboard": {
      "completion_checks": [],
      "suggested_tasks": []
    },
    "deadlines": {
      "completion_checks": [],
      "suggested_tasks": []
    },
    "file management": {
      "completion_checks": [],
      "suggested_tasks": []
    },
    "notifications": {
      "completion_checks": [],
      "suggested_tasks": []
    }
  }
    
  matched_category = None

  if objective_key in SEEDED_OBJECTIVE_RESPONSES:
    response = SEEDED_OBJECTIVE_RESPONSES[objective_key]
  else:
    for category, keywords in categories.items():
      for keyword in keywords:
        if keyword in feature_lower:
          matched_category = category
          break
    
      if matched_category:
        break
  
    if matched_category:
      response = CATEGORY_RESPONSES[matched_category]
    else:
      response = {
        "completion_checks": ["General checks"],
        "suggested_tasks": ["General planning tasks"]
      }

  return {
    "story_summary": f"{project_title}..{objective}...{feature}",
    "completion_checks": response["completion_checks"],
    "suggested_tasks": response["suggested_tasks"]
    } 

def build_user_story_response(validated_data):
    return generate_story_with_rules(validated_data)