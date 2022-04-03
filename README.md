# SAMY

## Introduction
Samy is a geo-tagging web application for cyclists. 

It allows user to report issues they can encounter on their path. 

Thanks to SPA (Single Page Application) architecture, the app can be installed almost as a native app by adding it to the home screen on Andoird & iOS. 

## Architecture
Samy-app is based on React to generate the UI and Django REST framework
to make the API. It is containerised in a docker container which
integrates NGINX to serve js code (REACT) & communicate with API
through WGSI (gunicorn).


## File structure
As explained, there is two different project : 
- The front-end (React)
- The back-end (Django REST Framework)

Apart, we also have a docker container that allows to run at the same time the front-end and the back-end.

This docker container serves static files build with REACT & access DB through REST API made with Django REST Framework. 

```
├── api                     # Django API app (back-end)
├── config                  # Config files (nginx, gunicorn, supervisor).
├── react-ui                # React files.
├── samy                    # Config files for Django.  
```

### Front-end
Important files are located in the src folder.
```

├── react-ui                   
    ├── public                  # icons, index.htm, manifest. 
    ├── src                     # Source files (alternatively `lib` or `app`)
```

### Back-end
APi is based on Django & Django REST Framework. A classical MySQL instance is used to store data.
```

├── api     
    ...                     # see doc of django & django rest to see functions of those files
    ├── migrations          # Auto-generated files (manage.py makemigrations)
    ├── templates
        ├── templated_email # Temmplates for e-mails (register, forgot password)
├── samy                    # config files
    ├── settings.py         # main config file 
```

## How to use it (Linux & MacOS)

Before to start the docker container, you need a MySQL db running. On local, you can achieve this easiy by running a MySQL db into Docker. 

To run the web server into a docker container follow those steps : 
```
# go to REACT folder
> cd ./react-ui

# need this env. var. to build the react static files. 
> export REACT_APP_HOST_PORT_COMPLETE="http://localhost:8000"    

# build static files
> npm run build 

# return to main folder
> cd ..

# build docker 
> docker build -t samy . 
       
TODO
```