files = file_one file_two

some_file: $(files)
	echo "Look at the variables: " ${files}
	touch some_file

file_one:
	touch file_one
file_two:
	touch file_two

clean:
	rm -rf file_one file_two some_file
