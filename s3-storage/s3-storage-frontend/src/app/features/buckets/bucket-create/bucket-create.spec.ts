import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketCreate } from './bucket-create';

describe('BucketCreate', () => {
  let component: BucketCreate;
  let fixture: ComponentFixture<BucketCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BucketCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BucketCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
