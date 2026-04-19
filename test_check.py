import yaml
import glob

def check():
    tags_correct = True
    for f in ["_reports/amazon-guardduty.md", "_reports/aws-security-hub.md"]:
        content = open(f, 'r').read()
        parts = content.split('---')
        y = yaml.safe_load(parts[1])
        if 'tags' not in y or set(y['tags']) != set(['SaaS', 'クラウド']):
            print(f"File {f} tags are incorrect: {y.get('tags')}")
            tags_correct = False

    # check related_tools
    content = open('_reports/aws-security-hub.md', 'r').read()
    y = yaml.safe_load(content.split('---')[1])
    if 'Amazon GuardDuty' not in y.get('relationships', {}).get('related_tools', []):
         print("Amazon GuardDuty missing from related_tools")
         tags_correct = False

    if tags_correct:
         print("Validation passed!")
check()
