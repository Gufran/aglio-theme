# Generate latest API documentation for the service

# Remote and branch name to generate the documentation from
# if you need the documentation from a different branch or remote
# you can do so by invoking `make latest` in following way:
#    make latest REMOTE=stage BRANCH=patch
#
# You can also use `args` variable to provide additional arguments
# for aglio, for example, to start a server you can run
# 	 make latest arg=-s
#
REMOTE := origin
BRANCH := master
SOURCE := blueprint.api
arg    :=

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
	@drafter blueprint.api -f json -t ast > apidraft.json && gulp

.PHONY : generate
generate: draft
	@aglio --no-cendense $(THEME) -i ./blueprint.api -o index.html $(arg)

.PHONY : blueprint
blueprint:
	@git show $(REMOTE)/$(BRANCH):$(SOURCE) > blueprint.api

.PHONY : clean
clean:
	@rm -rf apidraft.json blueprint.api
