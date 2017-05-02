#!/bin/sh
wget -qO- https://get.docker.com/ | sh

# To use docker without root
sudo usermod -aG docker $(whoami)