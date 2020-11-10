import Application from 'typing-trainer/app';
import config from 'typing-trainer/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
