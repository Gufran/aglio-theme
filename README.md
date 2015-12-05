# Aglio theme styling
This is a sligh styling touchup to default [aglio] theme being used at
http://opensource.kayako.com

It includes a makefile to automate the documentation generation on github pages.

## Assumptions made
The make task assumes certain configuration and currently can generate docs from only a single
blueprint file. Support to generate bulk documentation will be added soon.  

Assumptions:
 - You wish to generate the documentation on `gh-pages` branch
 - Default remote name is `origin`
 - Branch `origin/master` contains the latest api blueprint file named `blueprint.api`

## How To
### Setup
Let's begin with creating a branch for github pages, it can be done by checking out an orphan
branch from master

```
git checkout --orphan gh-pages
```

And then removing all files.

```
git rm -rf .
git commit --allow-empty -m 'Initial commit'
```

At this point you have an orphan branch named `gh-pages` with no files in it. Now fetch the theme

```
git fetch https://github.com/Gufran/aglio-theme
git merge FETCH_HEAD -m 'Install aglio theme'
```

You should now have a `Makefile`, `README.md` and `theme` directory.

## Generating documentation
Assuming that `origin` remote have a file `blueprint.api` in `master` branch, all you need is to
run

```
make latest
```

And you will have the API documentation generated and saved as `index.html`. Push `gh-pages` branch
to github and browse to http://username.github.io/project-name to view the docs.  
Replace `username` with your github username and `project-name` with the repository name in above URL 

### What happened here?
You can take a look into `Makefile` to get an idea of how things worked. As an overview, the `latest`
command will first download the `blueprint.api` file from `master` branch on `origin` remote and
use `aglio` to generate the documentation with this custom theme. 

## TODO
 - [] Use https://apiembed.com/ to embed code snippets for every API request

## Contribution
All contributions are welcome. Please fork the repository and send a pull request with your changes.

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the “Software”), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
