import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectUpload } from './object-upload';

describe('ObjectUpload', () => {
  let component: ObjectUpload;
  let fixture: ComponentFixture<ObjectUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
