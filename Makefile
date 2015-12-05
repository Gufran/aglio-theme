# Generate latest API documentation for the service

# Remote and branch name to generate the documentation from 
# if you need the documentation from a different branch or remote
# you can do so by invoking `make latest` in following way:
#    REMOTE=stage BRANCH=patch make latest
REMOTE := origin
BRANCH := master
SOURCE := blueprint.api

export NOCACHE=1

THEME := --theme-variables theme/theme-variables.less	\
	--theme-style default								\
	--theme-style theme/theme-style.less				\
	--theme-template theme/templates/index.jade 

.PHONY : latest
latest: blueprint  \
	generate

.PHONY: draft
draft:
	@drafter blueprint.api -o apidraft.json -f json -t ast

.PHONY : generate
generate: draft
	@aglio --no-cendense $(THEME) -s -i ./blueprint.api -o index.html

.PHONY : blueprint
blueprint:
	@git show $(REMOTE)/$(BRANCH):$(SOURCE) > blueprint.api

.PHONY : clean
clean:
	@rm -rf apidraft.json blueprint.api
