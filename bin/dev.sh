#!/bin/bash

FILE='../repos.txt'
isDir=false
yes=n

do_get_new () {
  running=true

  while $running; do
    echo 'Installation Path: '
    # Ask for the installation path for the
    # Tower modules.
    read directory

    if [ ! $directory ]; then
      echo 'You need to specify a directory...'
    else
      index=0
      dirs=()
      cat $FILE | while read line; do
        index=$(($index + 1))
        dirs=("${dirs[@]}" "$line")
      done

      echo ${dirs[@]}

      #dirs= ls -d -- $directory/*/
      #echo $dirs
    fi

  done

}

do_update () {

  echo ''
}

do_install () {
  echo "Directory to install Tower modules: "
  read directory

  if [ -d $directory ]; then
    isDir=true
    echo "Directory $directory already exists."
    echo "Do you still want to continue? (y/n) "
    read yes
  fi

  if [ "$yes" == 'y' ] || [ "$isDir" == 'false' ]; then
     # Create the directory.
    if [ ! -d $directory ]; then
      mkdir -p $directory
    fi

    prevPath=$PWD

    cat $FILE | while read line; do
      module=git@github.com:tower/$line.git
      git clone $module $directory/$line
      path=$directory/$line
      cd $path
      npm link
      cd $prevPath
    done


    # Install Everything.
    cat $FILE | while read line; do
      path=$directory/$line
      cd $path
      npm install
      cd $prevPath
    done

  fi

  if [ "$yes" == 'n' ]; then
    exit 0
  fi

  echo ''
}

# Check if there are any arguments.
if [ $1 ]; then

  # Update either specific repositories or
  # all of them.
  if [ $1 == 'update' ]; then
    do_update
    exit 0
  fi

  # Do a fresh installation of Tower modules.
  # This will link everything and do
  # installations for each module.
  if [ $1 == 'install' ]; then
    do_install
    exit 0
  fi

  # Get new modules that are added to Tower.
  if [ $1 == 'get-new' ]; then
    do_get_new
    exit 0
  fi

fi
