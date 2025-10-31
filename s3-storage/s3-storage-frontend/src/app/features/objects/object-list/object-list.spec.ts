import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectList } from './object-list';

describe('ObjectList', () => {
  let component: ObjectList;
  let fixture: ComponentFixture<ObjectList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
