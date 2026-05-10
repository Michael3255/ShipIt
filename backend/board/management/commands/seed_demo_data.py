from datetime import date, timedelta

from django.core.management.base import BaseCommand

from teams.models import Team
from users.models import User
from board.models import Project, Objective, Task, Comment


class Command(BaseCommand):
    help = 'Seed demo data for the ShipIt app'

    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        Comment.objects.all().delete()
        Task.objects.all().delete()
        Objective.objects.all().delete()
        Project.objects.all().delete()
        Team.objects.all().delete()

        demo_usernames = [
            'yee@smithhousehold.com',
            'julie@smithhousehold.com',
            'michael@smithhousehold.com',
            'vee@smithhousehold.com',
            'jessie@teamrocket.com',
            'james@teamrocket.com',
            'meowth@teamrocket.com',
            'leonardo@tmnt.com',
            'donatello@tmnt.com',
            'michaelangelo@tmnt.com',
            'raphael@tmnt.com',
            'ironman@avengers.com',
            'cap@avengers.com',
            'thor@avengers.com',
            'eren@surveycorps.com',
            'armin@surveycorps.com',
            'mikasa@surveycorps.com',
            'levi@surveycorps.com',
            'hange@surveycorps.com',
        ]

        User.objects.filter(username__in=demo_usernames).delete()

        teams = {
            'Smith Household': Team.objects.create(title='Smith Household'),
            'Team Rocket': Team.objects.create(title='Team Rocket'),
            'Teenage Mutant Ninja Turtles': Team.objects.create(
                title='Teenage Mutant Ninja Turtles'
            ),
            'Avengers': Team.objects.create(title='Avengers'),
            'Survey Corps': Team.objects.create(title='Survey Corps'),
        }

        user_team_map = {
            'yee@smithhousehold.com': 'Smith Household',
            'julie@smithhousehold.com': 'Smith Household',
            'michael@smithhousehold.com': 'Smith Household',
            'vee@smithhousehold.com': 'Smith Household',

            'jessie@teamrocket.com': 'Team Rocket',
            'james@teamrocket.com': 'Team Rocket',
            'meowth@teamrocket.com': 'Team Rocket',

            'leonardo@tmnt.com': 'Teenage Mutant Ninja Turtles',
            'donatello@tmnt.com': 'Teenage Mutant Ninja Turtles',
            'michaelangelo@tmnt.com': 'Teenage Mutant Ninja Turtles',
            'raphael@tmnt.com': 'Teenage Mutant Ninja Turtles',

            'ironman@avengers.com': 'Avengers',
            'cap@avengers.com': 'Avengers',
            'thor@avengers.com': 'Avengers',

            'eren@surveycorps.com': 'Survey Corps',
            'armin@surveycorps.com': 'Survey Corps',
            'mikasa@surveycorps.com': 'Survey Corps',
            'levi@surveycorps.com': 'Survey Corps',
            'hange@surveycorps.com': 'Survey Corps',
        }

        users = {}

        for username in demo_usernames:
            user = User.objects.create_user(
                username=username,
                password='abc123',
                email=username,
            )

            user.team = teams[user_team_map[username]]
            user.save()

            users[username] = user

        projects = {
            'Smith Household': Project.objects.create(
                title='Smith Household',
                description='Family errands and household maintenance.',
                owner=users['yee@smithhousehold.com'],
                team=teams['Smith Household'],
            ),
            'NYC Operations': Project.objects.create(
                title='NYC Operations',
                description='TMNT patrols, supplies, and underground operations.',
                owner=users['leonardo@tmnt.com'],
                team=teams['Teenage Mutant Ninja Turtles'],
            ),
            'Capture Pikachu': Project.objects.create(
                title='Capture Pikachu',
                description='Team Rocket operational planning.',
                owner=users['jessie@teamrocket.com'],
                team=teams['Team Rocket'],
            ),
            'Earth Defense Initiative': Project.objects.create(
                title='Earth Defense Initiative',
                description='Avengers global defense coordination.',
                owner=users['ironman@avengers.com'],
                team=teams['Avengers'],
            ),
            'Wall Maria Recon and Titan Suppression': Project.objects.create(
                title='Wall Maria Recon and Titan Suppression',
                description='Survey Corps titan response operations.',
                owner=users['levi@surveycorps.com'],
                team=teams['Survey Corps'],
            ),
        }

        objectives = {
            'Saturday Errand Day': Objective.objects.create(
                title='Saturday Errand Day',
                description='Weekend errands and shopping.',
                owner=users['yee@smithhousehold.com'],
                status='In Progress',
                due_date=date.today() + timedelta(days=7),
                project=projects['Smith Household'],
            ),
            'Household Chores': Objective.objects.create(
                title='Household Chores',
                description='Weekly home maintenance tasks.',
                owner=users['julie@smithhousehold.com'],
                status='To Do',
                due_date=date.today() + timedelta(days=10),
                project=projects['Smith Household'],
            ),
            'Saturday Supply Run': Objective.objects.create(
                title='Saturday Supply Run',
                description='TMNT supply and equipment gathering.',
                owner=users['leonardo@tmnt.com'],
                status='In Progress',
                due_date=date.today() + timedelta(days=5),
                project=projects['NYC Operations'],
            ),
            'Develop plans to capture Pikachu': Objective.objects.create(
                title='Develop plans to capture Pikachu',
                description='Team Rocket mission preparation.',
                owner=users['jessie@teamrocket.com'],
                status='To Do',
                due_date=date.today() + timedelta(days=6),
                project=projects['Capture Pikachu'],
            ),
            'Stark Tower Upgrades': Objective.objects.create(
                title='Stark Tower Upgrades',
                description='Technology and infrastructure upgrades.',
                owner=users['ironman@avengers.com'],
                status='In Progress',
                due_date=date.today() + timedelta(days=14),
                project=projects['Earth Defense Initiative'],
            ),
            'Team Combat Readiness': Objective.objects.create(
                title='Team Combat Readiness',
                description='Training and emergency response preparation.',
                owner=users['cap@avengers.com'],
                status='To Do',
                due_date=date.today() + timedelta(days=12),
                project=projects['Earth Defense Initiative'],
            ),
            'Titan Recon Mission': Objective.objects.create(
                title='Titan Recon Mission',
                description='Recon and scouting operations.',
                owner=users['hange@surveycorps.com'],
                status='In Progress',
                due_date=date.today() + timedelta(days=4),
                project=projects['Wall Maria Recon and Titan Suppression'],
            ),
            'Wall Maria Recovery': Objective.objects.create(
                title='Wall Maria Recovery',
                description='Recovery and emergency response operations.',
                owner=users['levi@surveycorps.com'],
                status='To Do',
                due_date=date.today() + timedelta(days=8),
                project=projects['Wall Maria Recon and Titan Suppression'],
            ),
        }

        task_data = [
            ('Grocery Shopping at Costco', 'Saturday Errand Day', 'To Do'),
            ('Pick up Prescriptions from Costco', 'Saturday Errand Day', 'Done'),
            ('Car wash and vacuum.', 'Saturday Errand Day', 'In Progress'),
            ('Return Amazon packages', 'Saturday Errand Day', 'To Do'),
            ('Buy Dog Food', 'Saturday Errand Day', 'To Do'),
            ('Buy hose from Home Depot', 'Household Chores', 'Done'),
            ('Clean gutters', 'Household Chores', 'In Progress'),
            ('Call local beekeeper', 'Household Chores', 'To Do'),
            ('Organize the garageq', 'Household Chores', 'To Do'),
            ('Fix hole in hallway', 'Household Chores', 'To Do'),
            ('Power wash the central AC unit', 'Household Chores', 'To Do'),

            ('Pick up Saturday night pizzas', 'Saturday Supply Run', 'To Do'),
            ('Restock grappling hook cartridges', 'Saturday Supply Run', 'In Progress'),
            ('Buy energy drinks', 'Saturday Supply Run', 'To Do'),
            ('Get first aid supplies', 'Saturday Supply Run', 'Done'),
            ('Cleaning supplies', 'Saturday Supply Run', 'In Progress'),
            ('Get Rebar from the abandoned building', 'Saturday Supply Run', 'Done'),

            ('Build upgraded electric proof net launcher', 'Develop plans to capture Pikachu', 'To Do'),
            ('Scout Ash’s current location', 'Develop plans to capture Pikachu', 'In Progress'),
            ('Prepare disguise costumes', 'Develop plans to capture Pikachu', 'Done'),
            ('Test portable Pikachu cage', 'Develop plans to capture Pikachu', 'To Do'),
            ('Rehearse dramatic villain speech', 'Develop plans to capture Pikachu', 'To Do'),

            ('Install new AI monitoring system', 'Stark Tower Upgrades', 'To Do'),
            ('Upgrade Quinjet navigation software', 'Stark Tower Upgrades', 'In Progress'),
            ('Create new Iron Man armor', 'Stark Tower Upgrades', 'In Progress'),
            ('Test emergency lockdown procedures', 'Team Combat Readiness', 'To Do'),
            ('Configure satellite threat detection alerts', 'Team Combat Readiness', 'Done'),
            ('Conduct tactical combat drills', 'Team Combat Readiness', 'To Do'),
            ('Update mission response protocols', 'Team Combat Readiness', 'To Do'),
            ('Perform Hulk containment testing', 'Team Combat Readiness', 'To Do'),
            ('Test Hulkbuster suit', 'Team Combat Readiness', 'To Do'),

            ('Map Titan activity', 'Titan Recon Mission', 'Done'),
            ('Prepare ODM gear', 'Titan Recon Mission', 'In Progress'),
            ('Check horses', 'Titan Recon Mission', 'In Progress'),
            ('Review emergency flare protocols', 'Titan Recon Mission', 'To Do'),
            ('Establish fallback rally points', 'Titan Recon Mission', 'To Do'),
            ('Analyze breach weak points', 'Wall Maria Recovery', 'Done'),
            ('Escort Eren to Trost District staging area', 'Wall Maria Recovery', 'To Do'),
            ('Protect Eren during Titan transformation', 'Wall Maria Recovery', 'To Do'),
            ('Establish fallback points', 'Wall Maria Recovery', 'To Do'),
            ('Assign Levi squad to emergency response', 'Wall Maria Recovery', 'To Do'),
        ]

        tasks = {}

        for index, (title, objective_title, status) in enumerate(task_data, start=1):
            tasks[title] = Task.objects.create(
                title=title,
                description=title,
                status=status,
                due_date=date.today() + timedelta(days=index),
                objective=objectives[objective_title],
            )

        comments = [
            ('Grocery Shopping at Costco', 'julie@smithhousehold.com', 'Let’s double check the shopping list before heading out.'),
            ('Grocery Shopping at Costco', 'yee@smithhousehold.com', 'Can someone check if we still need eggs?'),
            ('Grocery Shopping at Costco', 'julie@smithhousehold.com', 'Yes, eggs and paper towels for sure.'),
            ('Grocery Shopping at Costco', 'michael@smithhousehold.com', 'I can grab them if I go after work.'),
            ('Pick up Prescriptions from Costco', 'michael@smithhousehold.com', 'Picked these up already.'),
            ('Car wash and vacuum.', 'vee@smithhousehold.com', 'Still working on this. Vacuuming takes forever.'),
            ('Return Amazon packages', 'yee@smithhousehold.com', 'Packages are ready to go back.'),
            ('Buy Dog Food', 'julie@smithhousehold.com', 'We’re getting low on dog food pretty fast.'),
            ('Buy hose from Home Depot', 'michael@smithhousehold.com', 'Got the hose already from Home Depot.'),
            ('Clean gutters', 'vee@smithhousehold.com', 'Front gutters are done, still need to finish the back.'),
            ('Clean gutters', 'vee@smithhousehold.com', 'Back gutters are worse than I thought.'),
            ('Clean gutters', 'yee@smithhousehold.com', 'Do we need the taller ladder for that side?'),
            ('Clean gutters', 'michael@smithhousehold.com', 'Probably. I can bring it out later.'),
            ('Call local beekeeper', 'yee@smithhousehold.com', 'Need to give them a call sometime this afternoon.'),
            ('Organize the garageq', 'julie@smithhousehold.com', 'Garage is still a mess honestly.'),
            ('Organize the garageq', 'julie@smithhousehold.com', 'I found three boxes that can probably be donated.'),
            ('Organize the garageq', 'vee@smithhousehold.com', 'Good. The garage needs all the space it can get.'),
            ('Fix hole in hallway', 'michael@smithhousehold.com', 'Need to grab supplies for this first.'),
            ('Power wash the central AC unit', 'vee@smithhousehold.com', 'Need to be careful not to bend the fins while cleaning it.'),

            ('Pick up Saturday night pizzas', 'leonardo@tmnt.com', 'Don’t forget to pick these up before patrol starts.'),
            ('Restock grappling hook cartridges', 'donatello@tmnt.com', 'Need to check how many cartridges are left first.'),
            ('Restock grappling hook cartridges', 'donatello@tmnt.com', 'I upgraded the launcher mechanism last night.'),
            ('Restock grappling hook cartridges', 'raphael@tmnt.com', 'Just make sure it does not explode this time.'),
            ('Restock grappling hook cartridges', 'michaelangelo@tmnt.com', 'If it explodes, can we at least make it look cool?'),
            ('Buy energy drinks', 'michaelangelo@tmnt.com', 'We’re almost out again somehow.'),
            ('Get first aid supplies', 'leonardo@tmnt.com', 'Everything’s stocked up now.'),
            ('Get first aid supplies', 'leonardo@tmnt.com', 'Did we restock everything from the last patrol?'),
            ('Get first aid supplies', 'donatello@tmnt.com', 'Yeah, med kits and bandages are all packed now.'),
            ('Get first aid supplies', 'raphael@tmnt.com', 'Hopefully we do not need any of it tonight.'),
            ('Cleaning supplies', 'raphael@tmnt.com', 'Still need to grab a few more things.'),
            ('Cleaning supplies', 'michaelangelo@tmnt.com', 'Can we get the citrus cleaner again this time?'),
            ('Cleaning supplies', 'raphael@tmnt.com', 'Why does that even matter?'),
            ('Cleaning supplies', 'michaelangelo@tmnt.com', 'Because the sewer already smells bad enough.'),
            ('Get Rebar from the abandoned building', 'donatello@tmnt.com', 'Rebar pickup is done. This should help with the build.'),
            ('Get Rebar from the abandoned building', 'leonardo@tmnt.com', 'How much rebar did we actually get?'),
            ('Get Rebar from the abandoned building', 'donatello@tmnt.com', 'Enough for the support frame and backup braces.'),
            ('Get Rebar from the abandoned building', 'raphael@tmnt.com', 'Good. The last setup barely survived training.'),

            ('Build upgraded electric proof net launcher', 'meowth@teamrocket.com', 'Still waiting on a few parts before building this.'),
            ('Scout Ash’s current location', 'jessie@teamrocket.com', 'Ash keeps changing locations.'),
            ('Scout Ash’s current location', 'james@teamrocket.com', 'Ash was near the harbor earlier this morning.'),
            ('Scout Ash’s current location', 'jessie@teamrocket.com', 'Perfect. This time we finally catch Pikachu.'),
            ('Scout Ash’s current location', 'meowth@teamrocket.com', 'Yeah yeah, heard that one before.'),
            ('Prepare disguise costumes', 'james@teamrocket.com', 'Costumes are ready for the next operation.'),
            ('Test portable Pikachu cage', 'meowth@teamrocket.com', 'Need one more test run before using it.'),
            ('Rehearse dramatic villain speech', 'jessie@teamrocket.com', 'Needs more dramatic energy.'),
            ('Rehearse dramatic villain speech', 'james@teamrocket.com', 'Maybe add more dramatic pauses this time.'),
            ('Rehearse dramatic villain speech', 'jessie@teamrocket.com', 'Our entrance has to be memorable.'),
            ('Rehearse dramatic villain speech', 'meowth@teamrocket.com', 'I still think the smoke machine is too much.'),

            ('Install new AI monitoring system', 'ironman@avengers.com', 'Need to finish setup and testing.'),
            ('Upgrade Quinjet navigation software', 'ironman@avengers.com', 'Navigation update is halfway done.'),
            ('Create new Iron Man armor', 'ironman@avengers.com', 'Suit is coming together nicely so far.'),
            ('Create new Iron Man armor', 'cap@avengers.com', 'How many versions of this suit are there now?'),
            ('Create new Iron Man armor', 'ironman@avengers.com', 'Not enough.'),
            ('Create new Iron Man armor', 'thor@avengers.com', 'As long as one of them survives your testing.'),
            ('Test emergency lockdown procedures', 'cap@avengers.com', 'We should probably run another drill soon.'),
            ('Configure satellite threat detection alerts', 'thor@avengers.com', 'Alerts are configured and working now.'),
            ('Conduct tactical combat drills', 'cap@avengers.com', 'Need everyone present for this one.'),
            ('Update mission response protocols', 'cap@avengers.com', 'Still needs final review before rollout.'),
            ('Perform Hulk containment testing', 'thor@avengers.com', 'Maybe keep Hulk away from expensive equipment this time.'),
            ('Perform Hulk containment testing', 'cap@avengers.com', 'Please tell me Banner approved this test.'),
            ('Perform Hulk containment testing', 'thor@avengers.com', 'He said it was probably safe.'),
            ('Perform Hulk containment testing', 'ironman@avengers.com', 'Those are not reassuring words.'),
            ('Test Hulkbuster suit', 'ironman@avengers.com', 'Need a safer place to test this thing.'),

            ('Map Titan activity', 'hange@surveycorps.com', 'Finished mapping everything out. The titan movement pattern is strange.'),
            ('Map Titan activity', 'hange@surveycorps.com', 'Some of the tracks suddenly disappear near the forest edge.'),
            ('Map Titan activity', 'armin@surveycorps.com', 'That could mean abnormal titan behavior.'),
            ('Prepare ODM gear', 'levi@surveycorps.com', 'Need to refill gas supplies before heading out.'),
            ('Prepare ODM gear', 'hange@surveycorps.com', 'We should double check the gas reserves before leaving.'),
            ('Prepare ODM gear', 'levi@surveycorps.com', 'That should have been done already.'),
            ('Prepare ODM gear', 'eren@surveycorps.com', 'I can help finish loading supplies.'),
            ('Check horses', 'hange@surveycorps.com', 'Most of the horses look ready to go.'),
            ('Review emergency flare protocols', 'armin@surveycorps.com', 'We should review the signal colors again.'),
            ('Establish fallback rally points', 'levi@surveycorps.com', 'Still deciding on the best fallback locations.'),
            ('Analyze breach weak points', 'hange@surveycorps.com', 'Found a few weak spots in the wall already.'),
            ('Escort Eren to Trost District staging area', 'eren@surveycorps.com', 'Need to coordinate the escort team first.'),
            ('Protect Eren during Titan transformation', 'mikasa@surveycorps.com', 'Everyone’s nervous about this plan honestly.'),
            ('Protect Eren during Titan transformation', 'armin@surveycorps.com', 'We still need a backup plan if this fails.'),
            ('Protect Eren during Titan transformation', 'mikasa@surveycorps.com', 'Then we protect Eren no matter what happens.'),
            ('Protect Eren during Titan transformation', 'levi@surveycorps.com', 'Stay focused and stick to the plan.'),
            ('Establish fallback points', 'armin@surveycorps.com', 'These fallback points should match the main route.'),
            ('Assign Levi squad to emergency response', 'levi@surveycorps.com', 'Levi squad should probably lead this response.'),
        ]

        for task_title, username, body in comments:
            Comment.objects.create(
                task=tasks[task_title],
                user=users[username],
                body=body,
            )

        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully.'))