import csv
import json

def create_file(data_str, assignmentID, workerID, hitID):
	print("Create CSV function called")
	# Convert string to list of dictionaries
	data_list = json.loads(data_str)

	# Specify the CSV file path
	csv_file_path = 'output-dummy.csv'

	# Write extracted fields to CSV file
	with open(csv_file_path, 'w', newline='') as csvfile:
		fieldnames = ['AssignmentId', 'WorkerId', 'HITId', 'question', 'response', 'rating', 'startT', 'endT', 'responseT']
		writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

		# Write header
		writer.writeheader()

		# Write data
		for entry in data_list:
			# entry_row = json.loads(entry)
			writer.writerow({
				'AssignmentId': assignmentID,
				'WorkerId': workerID,
				'HITId': hitID,
				'question': entry['question'],
				'response': entry['response'],
				'rating': entry['rating'],
				'startT': entry['startT'],
				'endT': entry['endT'],
				'responseT': entry['responseT']
			})

	print(f'CSV file "{csv_file_path}" has been created.')


