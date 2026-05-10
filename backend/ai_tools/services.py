def build_user_story_response(validated_data):
    project_title = validated_data["project_title"]
    objective = validated_data["objective"]
    feature = validated_data["feature"]

    return {
  "story_summary": "A plain-language summary of what the team is trying to accomplish.",
  "completion_checks": [
    "Plain-language signs that this work is complete."
  ],
  "suggested_tasks": [
    "Small practical tasks the team can act on."
  ]
}