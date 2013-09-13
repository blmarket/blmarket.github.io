all: update build install

update:
	git submodule foreach git pull origin master

build:
	sh -c 'cd 6506197 && npm install && grunt'

install:
	cp 6506197/dist/* trello/

.PHONY: all update build install
