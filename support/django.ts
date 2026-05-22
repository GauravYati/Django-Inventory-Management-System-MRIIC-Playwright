import { execFileSync } from 'child_process';
import { getRuntimeConfig } from './config/env';

const runtimeConfig = getRuntimeConfig();

export const djangoProjectDir = runtimeConfig.djangoProjectDir;
export const pythonPath = runtimeConfig.pythonPath;

export const staffUser = {
  username: 'pw_staff',
  password: 'PwStaffPass123!',
  email: 'pw-staff@example.com'
};

export const testItems = {
  oscilloscope: 'Pw oscilloscope',
  sensorKit: 'Pw sensor kit',
  deleteTarget: 'Pw delete target'
};

const seedItemInput = {
  oscilloscope: 'PW Oscilloscope',
  sensorKit: 'PW Sensor Kit',
  deleteTarget: 'PW Delete Target'
};

export const testCategories = {
  electronics: 'PW Electronics',
  fabrication: 'PW Fabrication'
};

export function runDjango(code: string): void {
  execFileSync(pythonPath, ['manage.py', 'shell', '-c', code], {
    cwd: djangoProjectDir,
    encoding: 'utf8',
    stdio: 'pipe'
  });
}

export function migrateDatabase(): void {
  execFileSync(pythonPath, ['manage.py', 'migrate', '--noinput'], {
    cwd: djangoProjectDir,
    encoding: 'utf8',
    stdio: 'pipe'
  });
}

export function resetTestData(): void {
  migrateDatabase();
  runDjango(`
from django.contrib.auth.models import User
from mriic.models import BorrowRequest, Category, Item

TEST_ITEM_NAMES = ['${testItems.oscilloscope}', '${testItems.sensorKit}', '${testItems.deleteTarget}']
TEST_CATEGORY_NAMES = ['${testCategories.electronics}', '${testCategories.fabrication}']

BorrowRequest.objects.filter(item__name__in=TEST_ITEM_NAMES).delete()
Item.objects.filter(name__in=TEST_ITEM_NAMES).delete()
Category.objects.filter(name__in=TEST_CATEGORY_NAMES).delete()

staff, _ = User.objects.update_or_create(
    username='${staffUser.username}',
    defaults={'email': '${staffUser.email}', 'is_staff': True, 'is_superuser': True, 'is_active': True},
)
staff.set_password('${staffUser.password}')
staff.save()

electronics = Category.objects.create(name='${testCategories.electronics}')
fabrication = Category.objects.create(name='${testCategories.fabrication}')

oscilloscope = Item.objects.create(
    name='${seedItemInput.oscilloscope}',
    item_img='images/logo2.png',
    item_qty=5,
    featured=True,
    item_desc='Seeded oscilloscope for Playwright automation.',
)
oscilloscope.category.add(electronics)
oscilloscope.tags.add('scope', 'measurement')

sensor = Item.objects.create(
    name='${seedItemInput.sensorKit}',
    item_img='images/logo2.png',
    item_qty=3,
    featured=False,
    item_desc='Seeded sensor kit for Playwright automation.',
)
sensor.category.add(fabrication)
sensor.tags.add('sensor', 'kit')

delete_target = Item.objects.create(
    name='${seedItemInput.deleteTarget}',
    item_img='images/logo2.png',
    item_qty=2,
    featured=False,
    item_desc='Seeded delete target for Playwright automation.',
)
delete_target.category.add(electronics)
`);
}
