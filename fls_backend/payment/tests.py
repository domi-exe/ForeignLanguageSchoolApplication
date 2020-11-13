from unittest import TestCase

from app.models import Person, User
from payment.models import Payment


class PaymentTestCase(TestCase):
    @classmethod
    def setUp(cls):
        cls.user = User.objects.create(username="username", password="password", user_type="STUDENT")
        cls.person = Person.objects.create(name="test", surname="test", user=cls.user, mobile_number="987456123",
                                           address="address")
        cls.payment = Payment.objects.create(person=cls.person)

    def test_information_fields(self):
        self.assertIsInstance(self.payment.person, Person)
        self.assertIsInstance(self.payment.description, str)
        self.assertIsInstance(self.payment.to_pay, float)
        self.assertIsInstance(self.payment.paid, bool)

    # def test_person_can_have_multiple_payments(self):
    #     payments = [Payment.objects.create() for _ in range(5)]
    #     for payment in payments:
    #         payment.person = self.person
    #     count = Payment.objects.filter(person=self.person)
    #     self.assertEquals(len(payments), count)
