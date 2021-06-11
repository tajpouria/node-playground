# $@ Outputs the target
# $? Outputs all the prerequisites newer than the target
# $& Outputs all the prerequisites
hey: one two
	echo $@

	echo $?

	echo $^

	touch hey

one:
	touch one

two:
	touch two

clean:
	rm -rf hey one two