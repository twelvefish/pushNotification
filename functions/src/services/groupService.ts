import * as admin from 'firebase-admin';
import { Group } from '../model';

const groupCollection = admin.firestore().collection("Group");
